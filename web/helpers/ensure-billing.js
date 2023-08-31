
import { Shopify } from "@shopify/shopify-api";
import axios from "axios";
import NewPool from "pg";

const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});
pool.connect((err, result) => {
  if (err) throw err;
});
const price_plans = await pool.query(`SELECT * FROM  pricing_plans`);

export const BillingInterval = {
  OneTime: 'ONE_TIME',
  Every30Days: 'EVERY_30_DAYS',
  Annual: 'ANNUAL',
};

const RECURRING_INTERVALS = [
  BillingInterval.Every30Days,
  BillingInterval.Annual,
];

let isProd;
let date = new Date();
/**
 * You may want to charge merchants for using your app. This helper provides that function by checking if the current
 * merchant has an active one-time payment or subscription named `chargeName`. If no payment is found,
 * this helper requests it and returns a confirmation URL so that the merchant can approve the purchase.
 *
 * Learn more about billing in our documentation: https://shopify.dev/apps/billing
 */
// Check if any subscription is active or not
export default async function ensureBilling(
  session,
  { chargeName, amount, currencyCode, interval, collecting_phones },

  isProdOverride = process.env.NODE_ENV === 'production'
) {
  if (!Object.values(BillingInterval).includes(interval)) {
    throw `Unrecognized billing interval '${interval}'`;
  }
  /* Uncomment This line to TEST for environment */
  // isProd = isProdOverride;
  let hasPayment;
  let confirmationUrl = null;

  if (await hasActivePayment(session, { chargeName, interval })) {
    hasPayment = true;
  } else {
    hasPayment = false;
    confirmationUrl = await requestPayment(session, {
      chargeName,
      amount,
      currencyCode,
      interval,
      collecting_phones,
    });
  }
  return [hasPayment, confirmationUrl];
}

// Function to Check Active Payment(One-time, Recurring)
async function hasActivePayment(session, { chargeName, interval }) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  if (isRecurring(interval)) {
    const currentInstallations = await client.query({
      data: RECURRING_PURCHASES_QUERY,
    });
    const subscriptions =
      currentInstallations.body.data.currentAppInstallation.activeSubscriptions;

    for (let i = 0, len = subscriptions?.length; i < len; i++) {
      if (
        subscriptions[i].name === chargeName &&
        !subscriptions[i].test // !isProd ||
      ) {
        return true;
      }
    }
  } else {
    let purchases;
    let endCursor = null;
    do {
      const currentInstallations = await client.query({
        data: {
          query: ONE_TIME_PURCHASES_QUERY,
          variables: { endCursor },
        },
      });
      purchases =
        currentInstallations.body.data.currentAppInstallation.oneTimePurchases;

      for (let i = 0, len = purchases.edges.length; i < len; i++) {
        const node = purchases.edges[i].node;
        if (
          node.name === chargeName &&
          !node.test && //!isProd ||
          node.status === 'ACTIVE'
        ) {
          return true;
        }
      }

      endCursor = purchases.pageInfo.endCursor;
    } while (purchases.pageInfo.hasNextPage);
  }
  return false;
}

// Request for Payment according to payment interval
async function requestPayment(
  session,
  { chargeName, amount, currencyCode, interval, collecting_phones }
) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const returnUrl = `https://${Shopify.Context.HOST_NAME}?shop=${
    session.shop
  }&host=${Buffer.from(`${session.shop}/admin`).toString('base64')}`;

  let data;
  if (isRecurring(interval)) {
    // Request Recurring Payment with Collecting_phones add-ons
    const mutationResponse = await requestRecurringPayment(client, returnUrl, {
      chargeName,
      amount,
      currencyCode,
      interval,
      collecting_phones,
    });
    data = mutationResponse.body.data.appSubscriptionCreate;
  } else {
    const mutationResponse = await requestSinglePayment(client, returnUrl, {
      chargeName,
      amount,
      currencyCode,
    });
    data = mutationResponse.body.data.appPurchaseOneTimeCreate;
  }
  if (data.userErrors?.length) {
    console.log(data.userErrors, "Errror in reqest payment");
    throw new ShopifyBillingError(
      'Error while billing the store',
      data.userErrors
    );
  }

  return data.confirmationUrl;
}

async function requestRecurringPayment(
  client,
  returnUrl,
  { chargeName, amount, currencyCode, interval, collecting_phones }
) {
  // Calculate the total bill by adding the selected plan price and the add-ons amount
  let totalBill = parseFloat(amount);
  if (collecting_phones) {
    totalBill += 5.0; // Assuming here the add-ons amount is $5
  }
  const mutationResponse = await client.query({
    data: {
      query: RECURRING_PURCHASE_MUTATION,
      variables: {
        name: chargeName,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                interval,
                price: {
                  amount: totalBill,
                  currencyCode: currencyCode, // Set the correct currency code here
                },
              },
            },
          },
        ],
        returnUrl,
        test: true, //!isProd,
      },
    },
  });

  if (mutationResponse.body.errors) {
    console.log(mutationResponse.body.errors, "Request recurring failed");
    throw new ShopifyBillingError(
      'Error while billing the store',
      mutationResponse.body.errors
    );
  }
  return mutationResponse;
}

async function requestSinglePayment(
  client,
  returnUrl,
  { chargeName, amount, currencyCode }
) {
  const mutationResponse = await client.query({
    data: {
      query: ONE_TIME_PURCHASE_MUTATION,
      variables: {
        name: chargeName,
        price: { amount, currencyCode },
        returnUrl,
        test: process.env.NODE_ENV !== 'production',
      },
    },
  });

  if (mutationResponse.body.errors) {
    //&& mutationResponse.body.errors.length
    throw new ShopifyBillingError(
      'Error while billing the store',
      mutationResponse.body.errors
    );
  }

  return mutationResponse;
}

export async function getSubscriptionCharge(session) {
  const baseUrl = `https://${session?.shop}/admin/api/2023-04/recurring_application_charges.json`;
  try {
    let response = await axios.get(baseUrl, {
      headers: {
        'X-Shopify-Access-Token': session?.accessToken,
        'Content-Type': 'application/json',
      },
    });
    const RecurringChargeList = response?.data?.recurring_application_charges; //return list of all recurring charges
    let activePlan = RecurringChargeList?.find(
      (recurringCharge) => recurringCharge?.status === 'active' //Get active charge Plan details (Id, price,status)
    );

    return activePlan;
  } catch (err) {
    console.error(err, "Error to Get Current RecurringCharge");
  }
}

let subscribed_id;

// Get Current Active Subscription Plan Object From (recurring_application_charges) API

export async function getCurrentActivePricingPlan(session) {
  // function to get all Recurring charge list (Extract only active charge)
  let current_plan = await getSubscriptionCharge(session);

  subscribed_id = current_plan?.id;
  // Save the Active plan details in subscription_list Table of database
  await saveSubscribedPlan(current_plan, session);
}

// Save the Subscribed Plan into the database
async function saveSubscribedPlan(subscribedPlan, session) {
  const planExists = await pool.query(
    `select * from subscriptions_list where shop_id =$1`,
    [session?.shop]
  );
  // Subscription Exists ====> Add it Into Database
  if (subscribedPlan) {
    const charged_name = subscribedPlan?.name.split(" + ");
    const tierName = charged_name[0]; // Extract "Tier Name"

    let myPlan = price_plans?.rows.find((plan) => plan?.plan_name === tierName);

    myPlan['billing_required'] = true;
    const { plan_name, billing_required } = myPlan;
    let totalBill, collectingPhones, subscriptionId;

    // Findout the Tier Allotted Price and Tier Charged Price
    if (subscribedPlan?.price == myPlan?.price) {
      collectingPhones = false;
    } else {
      collectingPhones = true;
    }
    totalBill = subscribedPlan?.price;

    subscriptionId = `gid://shopify/AppSubscription/${subscribedPlan?.id}`;

    if (planExists?.rowCount === 0) {
      try {
        const savePlan = await pool.query(
          `INSERT INTO subscriptions_list (plan_name, price, created_at, subscription_id, billing_status, shop_id,billing_required,collecting_phones) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)`,
          [
            subscribedPlan?.name,
            totalBill,
            subscribedPlan?.created_at,
            subscriptionId,
            subscribedPlan?.status,
            session?.shop,
            billing_required,
            collectingPhones,
          ]
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const updatePlan = await pool.query(
          `UPDATE subscriptions_list SET
           plan_name=$1, 
           price=$2,
           created_at=$3,
           subscription_id=$4,
           billing_status=$5,
           billing_required=$6,
           collecting_phones = $7
           WHERE 
            shop_id=$8`,
          [
            subscribedPlan?.name,
            totalBill,
            subscribedPlan?.updated_at,
            subscriptionId,
            subscribedPlan?.status,
            billing_required,
            collectingPhones,
            session?.shop,
          ]
        );
      } catch (error) {
        return error;
      }
    }
    return 'Updated DB';
  } else {
    // Save the Free Plan Details Only when user Installs the App first time
    if (planExists?.rowCount <= 0) {
      try {
        const newPlan = await pool.query(
          `INSERT INTO subscriptions_list (plan_name, price, created_at, subscription_id, billing_status, shop_id, billing_required,collecting_phones) VALUES ($1, $2, $3, $4, $5, $6,$7,$8)`,
          [
            'Free',
            0.0,
            date.toISOString(),
            '',
            'NOT ACTIVE',
            session?.shop,
            false,
            false,
          ]
        );
        return 'Update Free Plan';
      } catch (err) {
        console.log(err);
        return err;
      }
    }
  }
}

// ------------ Cancel Subscription Billing Model-------------//

// Request Cancel App Subscription function with the app subscription ID

async function requestCancelSubscription(session, myId) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const mutationResponse = await client.query({
    data: {
      query: CANCEL_MUTATION,
      variables: {
        id: myId,
      },
    },
  });

  let data = mutationResponse?.body?.data?.appSubscriptionCancel;


  if (data?.userErrors.length) {
    console.log(data.userErrors, 'Error for cancelling request');
    throw new ShopifyBillingError(
      'Error while billing the store',
      data.userErrors
    );
  }
  return data;
}

// Cancel App Subscriptions & save Data to DB
export async function cancelAppSubscription(session, collecting_phones) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  const planExists = await pool.query(
    `select * from subscriptions_list where shop_id =$1`,
    [session?.shop]
  );

  let plan_Id = planExists?.rows[0]?.subscription_id;

  // let currentId = await getCurrentSubscriptionId(client);
  let totalBill = parseFloat('0.0');
  if (collecting_phones === true) {
    totalBill += 5.0;
  } else {
    totalBill += 0.0;
  }
  // If any paid Plan Exists in DB Already, then cancel app subscription with the subscription ID
  if (planExists?.rowCount > 0 && plan_Id) {
    let cancel_plan = await requestCancelSubscription(session, plan_Id);
    let cancelSubscription = cancel_plan?.appSubscription;
    //  error on cancel Subscription
    if (cancel_plan?.userErrors?.length) {
      throw new ShopifyBillingError(
        'Error while cancel the store subscription',
        cancel_plan?.userErrors
      );
    } else {
      if (planExists?.rowCount === 0) {
        try {
          const savePlan = await pool.query(
            `INSERT INTO subscriptions_list (plan_name, price, created_at, subscription_id, billing_status, shop_id, collecting_phones,billing_required) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING *`,
            [
              'Free',
              totalBill,
              date.toISOString(),
              '',
              '',
              session?.shop,
              collecting_phones,
              false,
            ]
          );

          return savePlan?.rows[0];
        } catch (err) {
          return err;
        }
      } else {
        try {
          const updatePlan = await pool.query(
            `UPDATE subscriptions_list SET
           plan_name=$1, 
           price=$2,
           created_at=$3,
           subscription_id=$4,
           billing_status=$5, 
           billing_required=$6,
           collecting_phones=$7
           WHERE
           shop_id=$8 RETURNING *`,
            [
              'Free',
              totalBill,
              date.toISOString(),
              '',
              cancelSubscription?.status,
              false,
              collecting_phones,
              session?.shop,
            ]
          );
          return updatePlan?.rows[0];
        } catch (error) {
          return error;
        }
      }
    }
  }
  //  If No Plan Exists in Database then user can only
  else if (planExists?.rowCount <= 0) {
    try {
      const savePlan = await pool.query(
        `INSERT INTO subscriptions_list (plan_name, price, created_at, subscription_id, billing_status, shop_id,collecting_phones, billing_required) VALUES ($1, $2, $3, $4, $5, $6,$7,$8) RETURNING *`,
        [
          'Free',
          totalBill,
          date.toISOString(),
          '',
          '',
          session?.shop,
          false,
          false,
        ]
      );
      return savePlan?.rows[0];
    } catch (err) {
      return err;
    }
  }
}

function isRecurring(interval) {
  return RECURRING_INTERVALS.includes(interval);
}

export function ShopifyBillingError(message, errorData) {
  this.name = 'ShopifyBillingError';
  this.stack = new Error().stack;

  this.message = message;
  this.errorData = errorData;
}
ShopifyBillingError.prototype = new Error();

// Create a webhook subscription for app subscription update

const webhookAddress = `https://provision-nursery-british-interference.trycloudflare.com/api/webhooks`;

// Depreciated Mutation for app subscription update webhook
export async function updateSubscription(session) {
  // webhookSubscriptionCreate(topic: APP_SUBSCRIPTIONS_UPDATE , webhookSubscription: {callbackUrl: "${appSubcriptionCB}", format: JSON}) {
  //
  // }

  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const data = await client.query({
    data: {
      query: `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
      webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
        webhookSubscription {
              id
              callbackUrl
              format
              topic
            }
            userErrors {
              field
              message
            }
      }
    }
    `,
      variables: {
        topic: "APP_SUBSCRIPTIONS_UPDATE",
        webhookSubscription: {
          callbackUrl: webhookAddress,
          format: "JSON",
        },
      },
    },
  });

  // let response = data?.body?.data?.webhookSubscriptionCreate;
  // if (response?.userErrors) {
  //   throw new ShopifyBillingError(
  //     "Error while updating subscription the store",
  //     response?.userErrors
  //   );
  // }
  return data?.body?.data?.webhookSubscriptionCreate;
}

const RECURRING_PURCHASES_QUERY = `
  query appSubscription {
    currentAppInstallation {
      activeSubscriptions {
        name, test,status,id
      }
    }
  }
`;

// Cancel Subscription Plan Mutation
const CANCEL_MUTATION = `mutation AppSubscriptionCancel($id: ID! ) {
  appSubscriptionCancel(
    id: $id 
    ) {
    userErrors {
      field
      message
    }
    appSubscription {
      id
      status
    }
  }
}`;

const ONE_TIME_PURCHASES_QUERY = `
  query appPurchases($endCursor: String) {
    currentAppInstallation {
      oneTimePurchases(first: 250, sortKey: CREATED_AT, after: $endCursor) {
        edges {
          node {
            name, test, status
          }
        }
        pageInfo {
          hasNextPage, endCursor
        }
      }
    }
  }
`;

const RECURRING_PURCHASE_MUTATION = `
  mutation test(
    $name: String!
    $lineItems: [AppSubscriptionLineItemInput!]!
    $returnUrl: URL!
    $test: Boolean
  ) {
    appSubscriptionCreate(
      name: $name
      lineItems: $lineItems
      returnUrl: $returnUrl
      test: $test
    ) {
      confirmationUrl
      appSubscription {
        id,status
        lineItems {
          id
          plan {
            pricingDetails {
              __typename
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ONE_TIME_PURCHASE_MUTATION = `
  mutation test(
    $name: String!
    $price: MoneyInput!
    $returnUrl: URL!
    $test: Boolean
  ) {
    appPurchaseOneTimeCreate(
      name: $name
      price: $price
      returnUrl: $returnUrl
      test: $test
    ) {
      confirmationUrl
      userErrors {
        field
        message
      }
      appSubscription {
        id
      }
    }
  }
`;
