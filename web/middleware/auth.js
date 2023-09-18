import { Shopify } from "@shopify/shopify-api";
import { gdprTopics } from "@shopify/shopify-api/dist/webhooks/registry.js";

import ensureBilling from "../helpers/ensure-billing.js";
import redirectToAuth from "../helpers/redirect-to-auth.js";

export default function applyAuthMiddleware(app, { billing = { required: false } } = { billing: { required: false } }) {
  app.get("/api/auth", async (req, res) => {
    return redirectToAuth(req, res, app);
  });

  app.get("/api/auth/callback", async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );

      const responses = await Shopify.Webhooks.Registry.registerAll({
        shop: session.shop,
        accessToken: session.accessToken,
      });

      Object.entries(responses).map(([topic, response]) => {
        // The response from registerAll will include errors for the GDPR topics.  These can be safely ignored.
        // To register the GDPR topics, please set the appropriate webhook endpoint in the
        // 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard.
        if (!response.success && !gdprTopics.includes(topic)) {
          if (response.result.errors) {
            console.log(
              `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
            );
          } else {
            console.log(
              `Failed to register ${topic} webhook: ${
                JSON.stringify(response.result.data, undefined, 2)
              }`
            );
          }
        }
      });

      // Registered App Uninstalled Webhook
      const response = await Shopify.Webhooks.Registry.register({
        path: "/api/webhooks",
        topic: "APP_UNINSTALLED",
        accessToken: session.accessToken,
        shop: session.shop,
      });

      console.log("response webhook registered", response);

      if (!response["APP_UNINSTALLED"].success) {
        console.log(
          `Failed to register APP_UNINSTALLED webhook: ${response.result}`
        );
      }

      // Registered App Subscription Update Webhook
      const appSubscription = await Shopify.Webhooks.Registry.register({
        path: "/api/webhooks",
        topic: "APP_SUBSCRIPTIONS_UPDATE",
        accessToken: session.accessToken,
        shop: session.shop,
      });

      console.log("response webhook registered", appSubscription);

      if (!appSubscription["APP_SUBSCRIPTIONS_UPDATE"].success) {
        console.log(
          `Failed to register APP_SUBSCRIPTIONS_UPDATE webhook: ${appSubscription.result}`
        );
      }

      // Register ORDERS_CREATE Webhook on App Installation
      const createOrder = await Shopify.Webhooks.Registry.register({
        path: '/api/webhooks',
        topic: 'ORDERS_CREATE',
        accessToken: session.accessToken,
        shop: session.shop,
      });

      Object.entries(createOrder).map(([topic, response]) => {
        if (!response.success && !gdprTopics.includes(topic)) {
          if (response.result.errors) {
            console.log(
              `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
            );
          } else {
            console.log(
              `Failed to register ${topic} webhook: ${
                JSON.stringify(response.result.data, undefined, 2)
              }`
            );
          }
        } else {
          console.log(
            `Webhook ${topic} Registered Successfully.`
          );
        }
      });

      // Register ORDERS_UPDATED Webhook on App Installation
      const updatedOrder = await Shopify.Webhooks.Registry.register({
        path: '/api/webhooks',
        topic: 'ORDERS_UPDATED',
        accessToken: session.accessToken,
        shop: session.shop,
      });

      Object.entries(updatedOrder).map(([topic, response]) => {
        if (!response.success && !gdprTopics.includes(topic)) {
          if (response.result.errors) {
            console.log(
              `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
            );
          } else {
            console.log(
              `Failed to register ${topic} webhook: ${JSON.stringify(
                response.result.data,
                undefined,
                2
              )}`
            );
          }
        } else {
          console.log(
            `Webhook ${topic} Registered Successfully.`
          );
        }
      });

      // Register ORDERS_CANCELLED Webhook on App Installation
      const cancelOrder = await Shopify.Webhooks.Registry.register({
        path: '/api/webhooks',
        topic: 'ORDERS_CANCELLED',
        accessToken: session.accessToken,
        shop: session.shop,
      });

      Object.entries(cancelOrder).map(([topic, response]) => {
        if (!response.success && !gdprTopics.includes(topic)) {
          if (response.result.errors) {
            console.log(
              `Failed to register ${topic} webhook: ${response.result.errors[0].message}`
            );
          } else {
            console.log(
              `Failed to register ${topic} webhook: ${
                JSON.stringify(response.result.data, undefined, 2)
              }`
            );
          }
        } else {
          console.log(
            `Webhook ${topic} Registered Successfully.`
          );
        }
      });

      // If billing is required, check if the store needs to be charged right away to minimize the number of redirects.
      if (billing.required) {
        const [hasPayment, confirmationUrl] = await ensureBilling(
          session,
          billing
        );

        if (!hasPayment) {
          return res.redirect(confirmationUrl);
        }
      }

      const host = Shopify.Utils.sanitizeHost(req.query.host);
      const redirectUrl = Shopify.Context.IS_EMBEDDED_APP
        ? Shopify.Utils.getEmbeddedAppUrl(req)
        : `/?shop=${session.shop}&host=${encodeURIComponent(host)}`;

      res.redirect(redirectUrl);
    } catch (e) {
      console.warn(e);
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          return redirectToAuth(req, res, app);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
