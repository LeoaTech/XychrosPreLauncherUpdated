// @ts-check
import { join } from "path";
import { readFileSync, readFile } from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import {
  Shopify,
  LATEST_API_VERSION,
  ShopifyHeader,
} from "@shopify/shopify-api";
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import { setupGDPRWebHooks } from "./gdpr.js";
import redirectToAuth from "./helpers/redirect-to-auth.js";
import { BillingInterval } from "./helpers/ensure-billing.js";
import { AppInstallations } from "./app_installations.js";
import cors from "cors";
import campaignApiEndpoints from "./middleware/campaign-api.js";
import referralsApiEndpoints from "./middleware/referrals.js";
import globalSettingsApiEndPoint from "./middleware/global-settings-api.js";
import bodyParser from "body-parser";
import createTemplateApiEndpoint from "./middleware/create_template.js";
import templatesApiEndpoints from "./middleware/templates_api.js";
import integrationApi from "./middleware/klaviyo-api.js";
import discountApiEndpoint from "./middleware/discount-api.js";
import userDetailsApiEndPoint from "./middleware/userdetails-api.js";
import getUrlApi from "./middleware/geturl-api.js";
import pricingPlansApiEndpoints from "./middleware/get-pricing-plans-api.js";
import SubscribePlanApiEndPoint from "./middleware/subscribe-plan-api.js";
import campaignDetailsApiEndpoints from "./middleware/campaign_details-api.js";
import { verifyWebhookRequest } from "./VerifyWebhook.js";
import {
  appUninstallEmail,
  send_email,
} from "./helpers/emails.js";
import { throwError } from "@shopify/app-bridge/actions/Error/index.js";

const USE_ONLINE_TOKENS = false;

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

// const DB_PATH = `${process.env.DATABASE_URL}`;
const DB_PATH = "postgres://postgres:postgres@localhost:5432/prelauncher";
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST.split("://")[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.PostgreSQLSessionStorage(DB_PATH),
});

let emailUninstall, emailUpgradeSubscription;

// App Uninstall Webhook to delete current app install session
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/api/webhooks",
  webhookHandler: async (_topic, shop, _body) => {
    const payload = JSON.parse(_body);
    console.log(payload, "Uninstalling");
    const { email } = payload;
    readFile("./email_templates/uninstall_app.txt", "utf8", (error, data) => {
      if (error) throwError;
      emailUninstall = data;
    });
    await AppInstallations.delete(shop);
    await appUninstallEmail(
      emailUninstall,
      email,
      "App Uninstallation Confirmation"
    );
  },
});


// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.

const BILLING_SETTINGS = {
  required: false, //initially false
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  chargeName: "My Shopify Every Month Charge",
  amount: 0.1,
  currencyCode: "USD",
  interval: BillingInterval.Every30Days,
};

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks("/api/webhooks");

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV == "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();

  app.set("use-online-tokens", USE_ONLINE_TOKENS);
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app, {
    billing: billingSettings,
  });

  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.

  app.post("/api/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
      return res.statusCode;
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });

  // Add middlewares to the request on '/api/webhooks' endpoint
  app.use("/api/webhooks", verifyWebhookRequest, setupGDPRWebHooks);

  //  API to get All Products in my Shopify Store
  app.get("/api/2022-10/products.json", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(
      req,
      res,
      app.get("use-online-tokens")
    );
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.all({ session });
    // await createWebhook(session);

    // console.log(countData);

    res.status(200).send(countData);
  });

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  SubscribePlanApiEndPoint(app);
  getUrlApi(app, process.env.SHOPIFY_API_SECRET);

  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );

  campaignApiEndpoints(app);
  campaignDetailsApiEndpoints(app);
  referralsApiEndpoints(app);
  createTemplateApiEndpoint(app);
  globalSettingsApiEndPoint(app);
  templatesApiEndpoints(app);
  integrationApi(app); //Klaviyo Integration API
  userDetailsApiEndPoint(app);
  discountApiEndpoint(app);
  pricingPlansApiEndpoints(app);

  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  app.use("/*", async (req, res, next) => {
    if (typeof req.query.shop !== "string") {
      res.status(500);
      return res.send("No shop provided");
    }

    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    const appInstalled = await AppInstallations.includes(shop);

    if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
      return redirectToAuth(req, res, app);
    }

    if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
      const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);

      return res.redirect(embeddedUrl + req.path);
    }

    const htmlFile = join(
      isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
      "index.html"
    );

    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(htmlFile));
  });

  return { app };
}

createServer().then(({ app }) => app.listen(PORT));
