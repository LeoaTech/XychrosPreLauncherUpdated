import { Shopify } from "@shopify/shopify-api";
import ensureBilling, {
  BillingInterval,
  cancelAppSubscription,
  getCurrentActivePricingPlan,
} from "../helpers/ensure-billing.js";
import NewPool from "pg";

const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});
pool.connect((err, result) => {
  if (err) throw err;
});

export default function SubscribePlanApiEndPoint(myApp) {
  const BILLING_SETTINGS = {
    required: false, //initially false
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    chargeName: "My Shopify Every Month Charge",
    amount: 0.1,
    currencyCode: "USD",
    interval: BillingInterval.Every30Days,
  };

  // Get the Current Plan Details from Database

  myApp.get("/api/subscribe-plan", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        myApp.get("use-online-tokens")
      );
      try {
        await getCurrentActivePricingPlan(session);

        const planExists = await pool.query(
          `select * from subscriptions_list where shop_id =$1`,
          [session?.shop]
        );
        return res.status(200).json(planExists?.rows[0]);
      } catch (error) {
        return res.json(error);
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });

  // POST Request for Subscribing to Paid Plan or Cancel Paid subscription

  myApp.post("/api/subscribe-plan", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        myApp.get("use-online-tokens")
      );

      const {
        billing_required,
        currency_code,
        plan_name,
        price,
        collecting_phones,
      } = req.body;

      let newAmount = price;
      // Update Plan_settings with Collecting_phones
      const plan_settings = {
        ...BILLING_SETTINGS,
        required: billing_required,
        chargeName: collecting_phones ? plan_name + " + Add-ons" : plan_name,
        amount: newAmount,
        currencyCode: currency_code,
        collecting_phones: collecting_phones,
      };

      // IF BilLing Required is TRUE & Subscribed to Paid Plan
      if (plan_settings.required) {
        const [hasPayment, confirmationUrl] = await ensureBilling(
          session,
          plan_settings
        );

        if (!hasPayment) {
          return res.json({ confirmationUrl: confirmationUrl });
        } else {
          return res.json("You have already subscribed to this plan");
        }
      } else {
        const planExists = await pool.query(
          `select * from subscriptions_list where shop_id =$1`,
          [session?.shop]
        );
        if (planExists?.rowCount > 0) {
          if (collecting_phones) {
            const [hasPayment, confirmationUrl] = await ensureBilling(
              session,
              plan_settings
            );
            if (!hasPayment) {
              return res.json({ confirmationUrl: confirmationUrl });
            } else {
              return res.json("You have already subscribed to this plan");
            }
          } else {
            const result = await cancelAppSubscription(
              session,
              collecting_phones
            );
            return res.status(200).json(result);
          }
        }
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  });

  // Merchant Renew Subscription plan with add-on Confirmation or cancel add-on subscription

  myApp.post("/api/confirm-add-ons", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        myApp.get("use-online-tokens")
      );

      const {
        billing_required,
        currency_code,
        plan_name,
        price,
        collecting_phones,
      } = req.body;

      let newAmount = price;
      // Update Plan_settings with Collecting_phones
      const addons_plan = {
        ...BILLING_SETTINGS,
        required: billing_required,
        chargeName: collecting_phones ? plan_name + " + Add-ons" : plan_name,
        amount: newAmount,
        currencyCode: currency_code,
        collecting_phones: collecting_phones,
      };

      // If BilLing Required is TRUE & Subscribed to Paid Plan
      if (addons_plan.required) {
        const [hasPayment, confirmationUrl] = await ensureBilling(
          session,
          addons_plan
        );
        if (!hasPayment) {
          return res.json({ confirmationUrl: confirmationUrl });
        } else {
          return res.json("You have already subscribed to this plan");
        }
      } else {
        // Cancel Add-on Subscription

        const result = await cancelAppSubscription(session, collecting_phones);
        console.log(result, "Cancel Plan");
        return res.status(200).json(result);
      }
    } catch (error) {
      console.log(error?.response?.errors, "error creating subscription");
      return error;
    }
  });
}
