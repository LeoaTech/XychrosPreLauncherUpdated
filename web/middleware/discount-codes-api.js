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


// Get Discount Codes From Store 
async function getCodesListNode(session) {
  try {
    const client = new Shopify.Clients.Graphql(
      session?.shop,
      session?.accessToken
    );

    let allDiscountCodes = [];

    const mutationResponse2 = await client.query({
      data: `query {
        discountNodes(first: 100) {
          edges {
            node {
              id
              discount {
                ... on DiscountCodeBasic {
                  title
                   codes(first: 5) {
                  nodes {
                    code
                  }
                }
                }
                ... on DiscountCodeBxgy {
                  title
                codes(first: 5) {
                  nodes {
                    code
                  }
                }
                }
                ... on DiscountCodeFreeShipping {
                  title
                  codes(first: 5) {
                    nodes {
                      code
                    }
                  }
                }
                ... on DiscountAutomaticApp {
                  title
                  
                }
                ... on DiscountAutomaticBasic {
                  title
                  
                }
                ... on DiscountAutomaticBxgy {
                  title
                 
                }
              
              }
            }
          }
        }
      }`,
    });

    // console.log(
    //   mutationResponse2?.body?.data?.discountNodes?.edges[0]?.node?.discount,
    //   "Mutation Response"
    // );

    let discountNodes = mutationResponse2?.body?.data?.discountNodes?.edges;
    if (discountNodes) {
      console.log(discountNodes);

      allDiscountCodes = allDiscountCodes.concat(
        discountNodes?.map(
          (disc) => disc?.node?.discount?.codes?.nodes[0]?.code
        )
      );
    }

    console.log(allDiscountCodes, "All Codes");

    return allDiscountCodes;
  } catch (error) {
    console.log(error?.response?.errors, "Mutation Response Error");
    return [];
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
