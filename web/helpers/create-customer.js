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
    console.error(
      "Error creating customer:",
      error?.response ? error.response.data : error.message
    );
    // throw error;
  }
}
