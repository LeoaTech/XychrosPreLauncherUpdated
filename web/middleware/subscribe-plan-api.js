import { Shopify } from '@shopify/shopify-api';
import ensureBilling, { BillingInterval } from '../helpers/ensure-billing.js';
import applyAuthMiddleware from './auth.js';

export default function SubscribePlanApiEndPoint(myApp) {
  // POST Request for Subscribing Paid Plan

  const BILLING_SETTINGS = {
    required: false, //initially false ---komal
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    chargeName: 'My Shopify Every Month Charge',
    amount: 0.1,
    currencyCode: 'USD',
    interval: BillingInterval.Every30Days,
  };

  myApp.post('/api/subscribe-plan', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        myApp.get('use-online-tokens')
      );

      // console.log(req.body, "Subscribe ")
      const { billing_required, currency_code, plan_name, price } = req.body;
      const plan_settings = {
        ...BILLING_SETTINGS,
        required: billing_required,
        chargeName: plan_name,
        amount: price,
        currencyCode: currency_code,
      };

      console.log('plan', plan_settings);
      if (plan_settings.required) {
        const [hasPayment, confirmationUrl] = await ensureBilling(
          session,
          plan_settings
        );

        console.log(confirmationUrl, 'URL');

        if (!hasPayment) {
          console.log(res, 'Response');
          return res.json({ confirmationUrl: confirmationUrl });
          // return res.redirect(`${confirmationUrl}`);
        } else {
          return res.json('You have already subscribed to this plan');
        }
      }
      applyAuthMiddleware(myApp, { billing: plan_settings });
    } catch (err) {
      console.log(err);
    }
  });
}
