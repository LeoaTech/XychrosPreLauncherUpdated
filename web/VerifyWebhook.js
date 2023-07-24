import crypto from "crypto";
import { Shopify, ShopifyHeader } from "@shopify/shopify-api";

/* Documentation Link for GDPR mandatory webhooks
    https://github.com/Shopify/shopify-api-js/issues/256 */


// Middleware function to Verify Request coming from Shopify 
export function verifyWebhookRequest(req, res, next) {
  try {
    const generatedHash = crypto
      .createHmac("SHA256", Shopify.Context.API_SECRET_KEY)
      .update(JSON.stringify(req.body), "utf8")
      .digest("base64");
    const hmac = req.get(ShopifyHeader.Hmac); // Equal to 'X-Shopify-Hmac-Sha256' at time of coding
    const safeCompareResult = Shopify.Utils.safeCompare(generatedHash, hmac);

    if (!!safeCompareResult) {
      console.log("hmac verified for webhook route, proceeding");
      next();
    } else {
      console.log("Shopify hmac verification for webhook failed, aborting");
      return res
        .status(401)
        .json({ succeeded: false, message: "Not Authorized" })
        .send();
    }
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ succeeded: false, message: "Error caught" })
      .send();
  }
}
