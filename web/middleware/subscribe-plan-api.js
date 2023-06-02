import { Shopify } from '@shopify/shopify-api';
import ensureBilling, { BillingInterval, GetCurrentAppInstallation, cancelAppSubscription } from '../helpers/ensure-billing.js';
import applyAuthMiddleware from './auth.js';
import NewPool from 'pg';
import verifyRequest from './verify-request.js';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

pool.connect((err, result) => {
  if (err) throw err;
  console.log('Connected');
});


export default function SubscribePlanApiEndPoint(myApp) {

  const BILLING_SETTINGS = {
    required: false, //initially false 
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    chargeName: 'My Shopify Every Month Charge',
    amount: 0.1,
    currencyCode: 'USD',
    interval: BillingInterval.Every30Days,
  };


  // Get the Current Plan Details from Database

  myApp.get('/api/subscribe-plan', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        myApp.get('use-online-tokens')
      );
      try {
        const getCurrent = await GetCurrentAppInstallation(session);
        console.log(getCurrent, "Get Response")
        const planExists = await pool.query(
          `select * from subscriptions_list where shop_id =$1`,
          [session?.shop]
        );
        return res.status(200).json(planExists?.rows[0]);
      } catch (error) {
        console.log(error)
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });


  // POST Request for Subscribing Paid Plan

  myApp.post('/api/subscribe-plan', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        myApp.get('use-online-tokens')
      );

      const { billing_required, currency_code, plan_name, price } = req.body;
      const plan_settings = {
        ...BILLING_SETTINGS,
        required: billing_required,
        chargeName: plan_name,
        amount: price,
        currencyCode: currency_code,
      };

      // IF BilLing Required is TRUE & Subscribe Paid Plan
      if (plan_settings.required) {

        const [hasPayment, confirmationUrl] = await ensureBilling(
          session,
          plan_settings
        );

        if (!hasPayment) {

          return res.json({ confirmationUrl: confirmationUrl });
        } else {
          return res.json('You have already subscribed to this plan');
        }

      } else {

        let date = new Date();
        const planExists = await pool.query(

          `select * from subscriptions_list where shop_id =$1`,
          [session?.shop]
        );

        if (planExists?.rowCount > 0) {
          const result = await cancelAppSubscription(session);
          console.log(result, "On Cancel")
          return res.status(200).json(result);
        } else {
          try {
            const savePlan = await pool.query(
              `INSERT INTO subscriptions_list (plan_name, price, created_at, subscription_id, billing_status, shop_id, billing_required) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *`,
              [
                plan_settings?.chargeName,
                plan_settings?.amount,
                date.toISOString(),
                '',
                '',
                session?.shop,
                plan_settings?.required
              ]
            );
            return res.status(200).json(savePlan?.rows[0])
          } catch (err) {
            return err;
          }
        }

      }
    } catch (err) {
      console.log(err);
    }
  });

}
