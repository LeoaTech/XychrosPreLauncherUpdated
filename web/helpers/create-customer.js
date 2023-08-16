import axios from "axios";

// Function to create a new customer on Shopify store
export default async function createCustomer(session, customerData) {
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
    console.log("Customer Created Successfully");
    return response?.data?.customer;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error Creating Customer");
  }
}

// Function to fetch all customers from app store
export async function getCustomersList(session) {
  // Set the base API URL for Shopify
  const baseUrl = `https://${session[0]?.shop}/admin/api/2023-04/customers.json`;

  try {
    let response = await axios.get(baseUrl, {
      headers: {
        "X-Shopify-Access-Token": session[0]?.accessToken,
        "Content-Type": "application/json",
      },
    });
    // console.log("customer mail", response?.data);
    let customers = response?.data?.customers;
    const customerData = customers.map((customer) => {
      const {
        email,
        phone,
        first_name,
        last_name,
        id,
        tags,
        created_at,
        updated_at,
      } = customer;
      return {
        email,
        phone,
        first_name,
        last_name,
        id,
        tags,
        created_at,
        updated_at,
      };
    });

    return customerData;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error Fetching Customers");
  }
}

// Function to update an existing customer on Shopify store
export async function updateCustomer(session, updatedCustomerData) {
  const customerId = updatedCustomerData.id;
  console.log("Add/Update Tags of Customer Having Id: ", [customerId]);
  try {
    // Set the base API URL for Shopify
    const baseUrl = `https://${session[0]?.shop}/admin/api/2022-10/customers/${customerId}.json`;

    const customer = {
      customer: updatedCustomerData,
    };

    // Set up the PUT request headers
    const headers = {
      "X-Shopify-Access-Token": session[0]?.accessToken,
      "Content-Type": "application/json",
    };

    // Make the POST request to the Shopify API
    const response = await axios.put(`${baseUrl}`, customer, {
      headers,
    });

    // Return the updated customer data
    console.log("Customer Updated Successfully");
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Error Updating Customer Tags", error);
  }
}
