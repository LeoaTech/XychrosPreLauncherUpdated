import { Shopify } from "@shopify/shopify-api";
import NewPool from "pg";
import { readFile } from "fs";

import { requestCancelSubscription } from "./helpers/ensure-billing.js";
import { AppInstallations } from "./app_installations.js";
import { appUninstallEmail } from "./helpers/emails.js";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

export function setupGDPRWebHooks(path) {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_DATA_REQUEST", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);

      // Define a function to request Customer data

      try {
        // Check if customer data present in database
        const getCustomer = await pool.query(
          `select * from referrals where email = $1`,
          [payload?.customer?.email]
        );

        if (getCustomer?.rows?.length > 0) {
          let customerData = getCustomer?.rows;
          console.log(customerData, "Customer data from DB");

          // Extract required fields from customer data List
          function extractData(arr) {
            const extractedData = {};
            for (const item of arr) {
              const { referral_code, email, created_at, campaign_id, revenue } =
                item;
              const signup_date = new Date(created_at).toISOString();
              const customerData = {
                referral_code,
                email,
                signup_date,
                campaigns_involved: campaign_id,
                revenue,
              };
              if (!extractedData[email]) {
                extractedData[email] = [];
              }
              extractedData[email].push(customerData);
            }

            console.log(extractedData);
            return extractedData;
          }

          const extractedDataObject = extractData(customerData);
          const extractedDataArray = Object.entries(extractedDataObject).map(
            ([email, data]) => ({
              [email]: data,
            })
          );
          console.log(extractedDataArray, "extracted data");

          // return extractedDataArray;
        } else {
          console.log("Customer not found");
        }
      } catch (error) {
        console.log(error);
      }

      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "orders_requested": [
      //     299938,
      //     280263,
      //     220458
      //   ],
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "data_request": {
      //     "id": 9999
      //   }
      // }
    },
  });

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  Shopify.Webhooks.Registry.addHandler("CUSTOMERS_REDACT", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
      console.log(payload, "Customers redact payload");

      try {
        // Find if customer exists in my database
        const customerExist = await pool.query(
          `select * from referrals where email = $1`,
          [payload?.customer?.email]
        );

        // If customer found
        if (customerExist?.rowCount > 0) {
          //  Delete customer data from app database
          await pool.query(`delete from referrals where email = $1`, [
            customerExist?.rows[0]?.email,
          ]);

          return "Customer Data deleted successfully";
        } else {
          console.log("Customer not found");
        }
      } catch (error) {
        console.log(error);
      }

      // Define a function to Delete Customer data
      // Payload has the following shape:

      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com",
      //   "customer": {
      //     "id": 191167,
      //     "email": "john@example.com",
      //     "phone": "555-625-1199"
      //   },
      //   "orders_to_redact": [
      //     299938,
      //     280263,
      //     220458
      //   ]
      // }
    },
  });

  // Every Time User update Plan, this webhook will Trigger
  Shopify.Webhooks.Registry.addHandler("APP_SUBSCRIPTIONS_UPDATE", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
      console.log(payload, "Update Subscriptions payload");
    },
  });


  // Send Emai User when Uninstalls the app.
  let emailUninstall;
  readFile("./email_templates/uninstall_app.txt", "utf8", (error, data) => {
    if (error) console.log(error, "for some reason");
    emailUninstall = data;
  });

  // App Uninstall webhook To Cancel App Subscription of Merchant
  Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/api/webhooks",
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
      console.log(payload, "Payload for Uninstalling webhook");
      const { email } = payload;
      let appSession;

      const shopSessions =
        await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shop);

      if (shopSessions?.length > 0) {
        for (const session of shopSessions) {
          if (session.accessToken) {
            appSession = session;
          }
        }
      } else {
        return false;
      }

      console.log(appSession, "Session to Cancel App Subscription");
      try {
        console.log("inside try block");
        await appUninstallEmail(
          emailUninstall,
          email,
          "App Uninstallation Confirmation"
        );

        // Find if subscriptionId exists in my database
        const subscriptionExist = await pool.query(
          `select * from subscriptions_list where shop_id =$1`,
          [shop]
        );

        console.log(subscriptionExist?.rows[0], "Exists in my database");

        // If Subscription Plan is Not Free or User has not already cancelled subscription
        if (subscriptionExist?.rowCount > 0) {
          let planId = subscriptionExist?.rows[0]?.subscription_id;
          console.log(planId, "Plan Id in Table");

          if (
            planId?.length == 0 ||
            (planId === "" && subscriptionExist?.rows[0]?.plan_name === "Free")
          ) {

            // No action needed to Cancel App Subscription
            console.log("inside if statemnent");
          } else {
            console.log("inside else");


            // Here we cancel the subscription Plan if any also if (plan is Free with Add-ons)
            let cancelSubscription = await requestCancelSubscription(
              appSession,
              planId
            );

            console.log(cancelSubscription, "cancel subscription webhook");
          }
        } else {
          return;
        }

        // Delete all data from the subscription table for the shop url and also delete the shopify session of that shop
        try {
          await pool.query(
            `DELETE FROM subscriptions_list WHERE shop_id = $1`,
            [shop]
          );
          await AppInstallations.delete(shop);
        } catch (err) {
          console.log(err, "delete subscription details for shop url");
        }
      } catch (error) {
        console.log(error, "App uninstall webhook Error");
      }
    },
  });

  /**
   * 48 hours after a store owner uninstalls your app, Shopify invokes this
   * webhook.
   *
   * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  Shopify.Webhooks.Registry.addHandler("SHOP_REDACT", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);

      console.log("Update Shop", payload);
      // Payload has the following shape:
      // {
      //   "shop_id": 954889,
      //   "shop_domain": "{shop}.myshopify.com"
      // }
    },
  });
}
