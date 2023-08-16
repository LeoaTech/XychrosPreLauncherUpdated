import crypto from "crypto";
import querystring from "querystring";

function getProxySignature(queryDict, secret) {
  // Sort and combine query parameters into a single string.
  console.log(queryDict, "Query parameters");
  const formattedQueryString = Object.keys(queryDict)
    .map(
      (key) =>
        `${key}=${
          Array.isArray(queryDict[key])
            ? queryDict[key].join(",")
            : queryDict[key]
        }`
    )
    .sort()
    .join("");
  console.log("format string", formattedQueryString);

  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(formattedQueryString, "utf-8")
    .digest("hex");

  // Return Calculated Signature
  console.log("signature Comuted", computedSignature);
  return computedSignature;
}

export async function isProxySignatureValid(request, secret) {
  const query_string = `shop=${request?.shop}&logged_in_customer_id=${request?.logged_in_customer_id}&path_prefix=${request?.path_prefix}&timestamp=${request?.timestamp}&signature=${request?.signature}`;

  const query_hash = querystring.parse(query_string);

  // Extract the signature to verify and then Remove it. If no signature is present, the request is invalid.

  const signatureToVerify = query_hash.signature;

  console.log(signatureToVerify, "Signature from query");
  if (!signatureToVerify) {
    return false;
  }
  delete query_hash.signature;

  const calculatedSignature = await getProxySignature(query_hash, secret);
  console.log(calculatedSignature, "Signature Genrated");

  // Use timingSafeEqual to reduce vulnerability to timing attacks.
  let validateSignature = crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, "hex"),
    Buffer.from(signatureToVerify, "hex")
  );

  if (validateSignature === true) {
    return true;
  } else {
    return false;
  }
}
