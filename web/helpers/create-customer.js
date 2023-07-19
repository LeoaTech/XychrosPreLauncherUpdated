import { Shopify } from "@shopify/shopify-api";
import axios from "axios";
export default async function createCustomer(session, customerData) {
  // Function to create a new customer on Shopify
  try {
    // Set the base API URL for Shopify
    const baseUrl = `https://${session[0]?.shop}/admin/api/2022-10/customers.json`;

    // Create the customer data object
    const customer = {
      customer: customerData,
    };
    // Set up the POST request headers
    const headers = {
      "X-Shopify-Access-Token": session[0]?.accessToken,
      "Content-Type": "application/json",
    };

    // Make the POST request to the Shopify API
    const response = await axios.post(`${baseUrl}`, customer, {
      headers,
    });

    // Return the newly created customer data
    return response?.data?.customer;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error creating customer:", error);
    throw error;
  }
}

// Grapgql Muatation to Create Customer


/* export default async function createCustomer(session, { email }) {
  console.log(session, email); // Check the structure of the session object
  const client = new Shopify.Clients.Graphql(
    session[0]?.shop,
    session[0]?.accessToken
  );

  console.log(client, "Client");
  const data = await client.query({
    data: {
      query: `mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
          email
          phone
          taxExempt
          acceptsMarketing
          firstName
          lastName
          ordersCount
          totalSpent
          smsMarketingConsent {
            marketingState
            marketingOptInLevel
          }
          addresses {
            address1
            city
            country
            phone
            zip
          }
        }
      }
    }`,
      variables: {
        input: {
          email: email,
          phone: "",
          firstName: "",
          lastName: "",
          acceptsMarketing: true,
          addresses: [
            {
              address1: "",
              city: "",
              province: "",
              phone: "",
              zip: "",
              lastName: "",
              firstName: "",
              country: "",
            },
          ],
        },
      },
    },
  });

  console.log(data, "Customer mutations");
  console.log(data?.body, "error"); // Log the errors, if any

  return data;
} */
