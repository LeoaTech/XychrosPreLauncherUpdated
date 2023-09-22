import { Shopify } from "@shopify/shopify-api";
import fetch from "node-fetch";
// Retrieves All discount Codes for all Campaigns

export default function discountCodesApiEndpoints(app) {
  app.get("/api/fetch_discount_codes", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      let result = await getCodesListNode(session);

      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
    }
  });
}

// Mutation to get Each type of Discounts and their associated Codes
async function getCodesListNode(session) {
  try {
    const client = new Shopify.Clients.Graphql(
      session?.shop,
      session?.accessToken
    );
    const mutationResponse = await client.query({
      data: `query {
        codeDiscountNodes(first: 10) {
          nodes {
            id
            codeDiscount {
              __typename
              ... on DiscountCodeBasic {
                title
                createdAt
                startsAt
                endsAt
                status
                summary
                codes(first: 2) {
                  nodes {
                    code
                  }
                }
              }
              ... on DiscountCodeBxgy {
                title
                createdAt
                startsAt
                endsAt
                status
                summary
                codes(first: 2) {
                  nodes {
                    code
                  }
                }
              }
              ... on DiscountCodeFreeShipping {
                title
                createdAt
                startsAt
                endsAt
                status
                summary
                codes(first: 2) {
                  nodes {
                    code
                  }
                }
              }
            }
          }
        }
        }`,
    });

    console.log(
      mutationResponse?.body?.data?.codeDiscountNodes?.nodes,
      "Mutation Response"
    );

    let discountCodes =
      mutationResponse?.body?.data?.codeDiscountNodes?.nodes?.map(
        (disc) => disc?.codeDiscount?.codes?.nodes[0]?.code
      );
    console.log(discountCodes, "Codes");

    if (discountCodes) {
      return discountCodes;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error?.response?.errors, "Mutation Response Error");
  }
}

async function getDiscountCodeUrl(session, discountCode) {
  try {
    const url = `https://${session?.shop}/admin/discount_codes/lookup.json?code=${discountCode}`;

    // Set Headers
    const headers = {
      "X-Shopify-Access-Token": session?.accessToken,
      "Content-Type": "application/json",
    };

    const result = await fetch(url, { headers });

    console.log(result, "API result");
    if (result.status === 200) {
      return { ok: true, url: result.url };
    }

    return { ok: false };
  } catch (err) {
    console.log(err, "ValidCode");
  }
}
