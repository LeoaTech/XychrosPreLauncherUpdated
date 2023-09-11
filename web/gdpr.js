import { Shopify } from "@shopify/shopify-api";
import NewPool from "pg";
import { readFile } from "fs";
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
  /* Shopify.Webhooks.Registry.addHandler("APP_SUBSCRIPTIONS_UPDATE", {
    path,
    webhookHandler: async (topic, shop, body) => {
      const payload = JSON.parse(body);
      console.log(payload, "Update Subscriptions payload");
    },
  }); */

  // Send Emai User when Uninstalls the app.
  let emailUninstall = "";
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

      try {
        // Send Email to Merchant for App Uninstall
        await appUninstallEmail(
          emailUninstall,
          email,
          "App Uninstallation Confirmation"
        );

        try {
          await AppInstallations.delete(shop); //Delete Shop session and subscriptions from database
        } catch (error) {
          console.log(error, "Error deleting Shop session");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Every Time User Places an Order, this Webhook will Trigger
  Shopify.Webhooks.Registry.addHandler("ORDERS_CREATE", {
    path: "/api/webhooks",
    webhookHandler: async (topic, shop, body) => {
      // Parse the incoming create/orders payload as JSON
      const payload = JSON.parse(body);
      // console.log("Order Created Payload: ", payload);

      const orders_data = {
        order_id: parseInt(payload?.id),
        name: payload?.name,
        subtotal_price: payload?.subtotal_price,
        total_discounts: payload?.total_discounts,
        total_price: parseFloat(payload?.total_price),
        discount_codes: payload?.discount_codes[0]?.code,
        currency: payload?.currency,
        customer_tags: payload?.customer?.tags,
        shop: payload?.order_status_url.match(/\/\/([^/]+)/)[1],
      }
      console.log(orders_data);

      const appNameTag = "viral-launch";

      // Check if customer has signed up using our app
      if (payload?.customer?.tags) {
        const customerTagsArray = payload.customer.tags.split(',').map(tag => tag.trim());
        if (customerTagsArray.includes(appNameTag)) {
          console.log(`Customer has signed up using our app`);
          // store required fields in database
          try {
            const query = `
              INSERT INTO order_details(
                order_id,
                order_name,
                subtotal_price,
                total_discounts,
                total_tax,
                total_price,
                discount_codes,
                currency,
                customer_tags,
                shop_id
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;
    
            const orders = await pool.query(query, [
              parseInt(payload?.id),
              payload?.name,
              parseFloat(payload?.subtotal_price),
              parseFloat(payload?.total_discounts),
              parseFloat(payload?.total_tax),
              parseFloat(payload?.total_price),
              payload?.discount_codes[0]?.code,
              payload?.currency,
              payload?.customer?.tags,
              payload?.order_status_url.match(/\/\/([^/]+)/)[1],
            ]);
    
            if (orders) {
              // console.log(orders);
              console.log('Query is successful');
            } else {
              console.log('Query failed');
            }
    
            return { status: 200, message: "Orders Data Processed Successfully" };
          } catch (error) {
            // Handle any errors that occur during payload parsing or processing
            console.error("Error Processing Webhook Data:", error);
            // Send an error response to Shopify, indicating the issue
            return { status: 500, message: "Internal Server Error", error: error.message };
          }
        } else {
          console.log(`Customer hasn't signed up using our app`);
        }
      } else {
        console.log("Customer has no tags..");
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
