import { Shopify } from "@shopify/shopify-api";
import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/prelauncher",
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
      // console.log(payload, "Customers data request");

      // Define a function to request Customer data

      try {
        const getCustomer = await pool.query(
          `select * from referrals where email = $1`,
          [payload?.customer?.email]
        );

        if (getCustomer?.rows?.length > 0) {
          console.log(getCustomer.rows[0]);
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
