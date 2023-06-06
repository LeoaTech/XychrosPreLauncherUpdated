import { Shopify } from '@shopify/shopify-api';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

pool.connect((err, result) => {
  if (err) throw err;
});

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
var subscribeId;
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
  { chargeName, amount, currencyCode, interval },
  isProdOverride = process.env.NODE_ENV === 'production'
) {
  if (!Object.values(BillingInterval).includes(interval)) {
    throw `Unrecognized billing interval '${interval}'`;
  }

  isProd = isProdOverride;

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

    if (subscriptions.length > 0) {
      let ID = await getCurrentSubscriptionId(client);
      subscribeId = ID;
    }
    for (let i = 0, len = subscriptions.length; i < len; i++) {
      if (
        subscriptions[i].name === chargeName &&
        (!isProd || !subscriptions[i].test)
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
          (!isProd || !node.test) &&
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

// When user install the app , it requests for app subscription
async function requestPayment(
  session,
  { chargeName, amount, currencyCode, interval }
) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const returnUrl = `https://${Shopify.Context.HOST_NAME}?shop=${
    session.shop
  }&host=${Buffer.from(`${session.shop}/admin`).toString('base64')}`;

  let data;
  if (isRecurring(interval)) {
    const mutationResponse = await requestRecurringPayment(client, returnUrl, {
      chargeName,
      amount,
      currencyCode,
      interval,
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
  if (data.userErrors.length) {
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
  { chargeName, amount, currencyCode, interval }
) {
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
                price: { amount, currencyCode },
              },
            },
          },
        ],
        returnUrl,
        test: !isProd,
      },
    },
  });

  if (mutationResponse.body.errors && mutationResponse.body.errors.length) {
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

  if (mutationResponse.body.errors && mutationResponse.body.errors.length) {
    throw new ShopifyBillingError(
      'Error while billing the store',
      mutationResponse.body.errors
    );
  }

  return mutationResponse;
}

// Cancel Subscription Billing Model

// Get Current App installation subscriptionID (requires for app installation function)

export async function getCurrentSubscriptionId(client) {
  const currentInstallations = await client.query({
    data: RECURRING_PURCHASES_QUERY,
  });
  const subscriptions =
    currentInstallations?.body?.data?.currentAppInstallation
      ?.activeSubscriptions;
  return subscriptions?.length > 0 ? subscriptions[0]?.id : null;
}

//   Request Cancel App Subscription function

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
    throw new ShopifyBillingError(
      'Error while billing the store',
      data.userErrors
    );
  }
  return data;
}

// Get Current App Installation data

export async function GetCurrentAppInstallation(session) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  const currentInstallations = await client.query({
    data: RECURRING_PURCHASES_QUERY,
  });
  const price_plans = await pool.query(`SELECT * FROM  pricing_plans`);

  // Check if subscriptions data exists already for this shop in DB
  const planExists = await pool.query(
    `select * from subscriptions_list where shop_id =$1`,
    [session?.shop]
  );

  const subscriptions =
    currentInstallations?.body?.data?.currentAppInstallation
      ?.activeSubscriptions;

  let date = new Date();

  let myPlan = price_plans?.rows.find(
    (plan) => plan?.plan_name === subscriptions[0]?.name
  );
  myPlan['billing_required'] = true;
  const { plan_name, price, billing_required } = myPlan;

  if (!subscriptions) {
    return 'No Subscriptions Active, Your are currently using Free Tier.';
  } else {
    if (subscriptions.length > 0) {
      if (planExists?.rowCount === 0) {
        try {
          const savePlan = await pool.query(
            `INSERT INTO subscriptions_list (plan_name, price, created_at, subscription_id, status, shop_id,billing_required) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              plan_name,
              price,
              date.toISOString(),
              subscriptions[0]?.id,
              subscriptions[0]?.status,
              session?.shop,
              billing_required,
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
             status=$5,
             billing_required=$6, 
             shop_id=$7`,
            [
              plan_name,
              price,
              date.toISOString(),
              subscriptions[0]?.id,
              subscriptions[0]?.status,
              billing_required,
              session?.shop,
            ]
          );
        } catch (error) {
          return error;
        }
      }
      return subscriptions[0];
    }
  }
}

// Cancel App Subscriptions & save Data to DB
export async function cancelAppSubscription(session) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  let currentId = await getCurrentSubscriptionId(client);

  if (currentId) {
    let cancel_plan = await requestCancelSubscription(session, currentId);
    console.log(cancel_plan, 'cancel result');
    let date = new Date();
    if (cancel_plan.userErrors.length) {
      throw new ShopifyBillingError(
        'Error while cancel the store subscription',
        cancel_plan?.userErrors
      );
    } else {
      try {
        let cancelSubscription = cancel_plan?.appSubscription;

        const planExists = await pool.query(
          `select * from subscriptions_list where shop_id =$1`,
          [session?.shop]
        );
        let planData = planExists?.rows[0];
        planData['billing_required'] = false;
        const { plan_name, price, billing_required } = planData;

        if (planExists?.rowCount === 0) {
          try {
            const savePlan = await pool.query(
              `INSERT INTO subscriptions_list (plan_name, price, created_at, subscription_id, status, shop_id, billing_required) VALUES ($1, $2, $3, $4, $5, $6,$7)`,
              [
                plan_name,
                price,
                date.toISOString(),
                cancelSubscription?.id,
                cancelSubscription?.status,
                session?.shop,
                billing_required,
              ]
            );
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
             status=$5, 
             billing_required=$6,
             shop_id=$7`,
              [
                plan_name,
                price,
                date.toISOString(),
                cancelSubscription?.id,
                cancelSubscription?.status,
                billing_required,
                session?.shop,
              ]
            );
          } catch (error) {
            return error;
          }
        }
      } catch (error) {
        return error;
      }
      return cancel_plan;
    }
  } else {
    return 'No Active Subscriptions Found';
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
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const APP_SUBSCRIPTIONS_UPDATE_MUTATION = `
mutation($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
  webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
    webhookSubscription {
      id
      topic
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
