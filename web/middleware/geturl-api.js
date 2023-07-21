import { Shopify } from "@shopify/shopify-api";
import queryString from "query-string";
import crypto from "crypto";
import emailValidator from "deep-email-validator";
import { add_to_klaviyo_list } from "../helpers/klaviyoIntegrations.js";
import NewPool from "pg";
import {
  replace_welcome_email_text,
  replace_referral_email_text,
  replace_reward_email_text,
  send_email,
} from "../helpers/emails.js";
import createCustomer, { updateCustomer } from "../helpers/create-customer.js";
import { throwError } from "@shopify/app-bridge/actions/Error/index.js";
import axios from "axios";

const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

export default function getUrlApi(app, secret) {
  app.post("/api/geturl", async (req, res) => {
    try {
      // console.log("I am here in fetch API URL");
      // console.log(req.query);
      // console.log(req.body);
      const shop = req.query.shop;
      const campaign = req.body.campaign_name;

      // console.log(shop);
      // console.log(campaign);

      const imageURL = await pool.query(
        `select t.welcome_image_url from templates t inner join campaign_settings c on t.id = c.template_id where c.name = '${campaign}' and c.shop_id = '${shop}'`
      );

      const campaign_details = await pool.query(
        `SELECT * from campaign_settings where name='${campaign}' and shop_id = '${shop}'`
      );

      res.status(200).json({
        success: true,
        imageURL: imageURL?.rows[0]?.image_url,
        campaign_data: campaign_details.rows[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
    }
  });

  // endpoint to get users for Shopify Customers

  // Landing page API
  app.post("/api/getuser", async (req, res) => {
    try {
      const query_signature = req.query.signature;
      let ip_address =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
      ip_address = ip_address.split(",")[0];

      let refererURL = req.headers.referer;
      refererURL = refererURL.split("?refer")[0];
      // console.log(refererURL);

      const { email, phone, refer, campaign, shop } = req.query;

      // Get App Session from Shop Domain
      const shopSession =
        await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shop);

      let message = "";


      /* -----------------     Get All Customers List of App Store     -------------------- */

      // Set the base API URL for Shopify
      const baseUrl = `https://${shopSession[0]?.shop}/admin/api/2023-04/customers.json`;
      let store_customers;
      try {
        let response = await axios.get(baseUrl, {
          headers: {
            "X-Shopify-Access-Token": shopSession[0]?.accessToken,
            Authorization: `Bearer ${shopSession[0]?.accessToken}`,
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

        store_customers = customerData;
      } catch (error) {
        console.log(error);
      }
      // console.log("customer List of App Store", store_customers);

      // Check if the Email user entered is Already in App Store customers list
      let findEmail = store_customers.find((data) => data.email === email);
      console.log(findEmail?.email, "Email Found");


      if (!email) {
        return res
          .status(500)
          .json({ success: false, message: "Please provide valid input" });
      }

      // const shop_id = 'offline_' + shop;

      const campaign_details = await pool.query(
        `SELECT * from campaign_settings where name='${campaign}' and shop_id='${shop}'`
      );
      const campaignID = campaign_details.rows[0].campaign_id;

      // console.log(email);
      // console.log(refer);
      // console.log(campaignID);

      // check if email is valid
      let isemail_valid = await emailValidator.validate(email);

      if (isemail_valid.validators.smtp.valid == false) {
        return res
          .status(404)
          .json({ success: false, message: "Please provide a valid email" });
      }

      // get referral code
      const users = await pool.query(
        `SELECT * FROM referrals where email='${email}' and campaign_id=${campaignID}`
      );

      let referralcode = "";

      //case of sign in
      if (users.rows[0]) {
        referralcode = users.rows[0].referral_code;
      } else {
        // get referral code for new sign-ups

        // check IP Addresses
        const getIPAddress = await pool.query(
          `SELECT count_ip FROM ip_addresses WHERE address='${ip_address}' and campaign_id=${campaignID}`
        );

        // Check if Email Customer entered already exists in database 
        const customerExists = await pool.query(
          `SELECT * FROM referrals where email= $1`,
          [email]
        );
        console.log("Email exists in Database");


        let count = 1;

        // previous entry of IP address
        if (getIPAddress.rows.length > 0) {
          count = getIPAddress.rows[0].count_ip;

          // ------------------ if IP exists more than 2 times -----------------
          if (count >= 2) {
            count = count + 1;
            await pool.query(
              `UPDATE ip_addresses SET count_ip=${count}, updated_at=now() WHERE address='${ip_address}' and campaign_id=${campaignID}`
            );

            return res.status(400).json({
              success: false,
              message: "You have already requested 2 times",
            });
          } else {

            // ---------------- if IP exists less than 2 times --------------------

            //add to Klaviyo List
            let klaviyo_list = await add_to_klaviyo_list(
              email,
              phone,
              campaign_details,
              shop
            );
            // console.log(klaviyo_list);

            // console.log('checked klaviyo list');

            count = count + 1;
            await pool.query(
              `UPDATE ip_addresses SET count_ip=${count}, updated_at=now() WHERE address='${ip_address}' and campaign_id=${campaignID}`
            );

            const getreferrals = await pool.query(
              `INSERT INTO referrals (email, referrer_id, campaign_id) VALUES ('${email}', '${refer}', ${campaignID}) RETURNING *`
            );

            // When a User signup with email, a new entry will be added in referrals table
            // Then we call out create customer function to add Customer data on Store

            // customer creation data
            let camp_name = campaign_details.rows[0].name;
            let tags = `viral-launch, ${camp_name}`;

            const customerData = {
              first_name: "",
              last_name: "",
              email: email,
              phone: phone || "",
              verified_email: true,
              tags: tags,
              addresses: [
                {
                  address1: "",
                  city: "",
                  province: "",
                  phone: phone || "",
                  zip: "",
                  last_name: "",
                  first_name: "",
                  country: "",
                },
              ],
            };

            // Check If Customer Already Exists in App Store or Database 

            try {
              // if Not Exists on App Store or Database
              if (customerExists?.rowCount == 0 && findEmail === undefined) {

                let currentCustomerData = await createCustomer(shopSession, customerData);
                console.log("Customer Created With Referral Code having Id: ", currentCustomerData.id);

              } else {
                // Update existing customer tags
                console.log("Customer already Exists with this Email: ", findEmail?.email);

                // -------------------------- More than one Campaign signups Based Customer Tags---------------------------

                let new_camp_name = campaign_details.rows[0].name;
                let newTag = `${new_camp_name}`;

                    const updatedCustomerData = {
                      id: findEmail.id,
                      tags: updatedTags,
                    };
                    await updateCustomer(shopSession, updatedCustomerData);
                    console.log('Customer Tags Updated Successfully - Customer Signed up for Another Campaign');
              }
            } catch (error) {
              console.log("Error Creating/Updating Customer", error);
              throwError;
            }

            referralcode = getreferrals.rows[0].referral_code;

            //prepare welcome email
            message = await replace_welcome_email_text(
              refererURL,
              campaign_details,
              shop,
              email
            );

            // console.log(message);
            //send welcome email
            let send_message = await send_email(
              message,
              email,
              "You have Subscribed"
            );
            // console.log(send_message);

            //check referrer code and send reward unlock email or referral email
            const referrer_process = await find_referrer(
              refererURL,
              refer,
              campaign_details,
              shop
            );
          }
        } else {

          //add to Klaviyo List
          let klaviyo_list = await add_to_klaviyo_list(
            email,
            phone,
            campaign_details,
            shop
          );

          // ------------------- IP address does not exist -----------------------
          let data = await pool.query(
            `INSERT INTO ip_addresses (address,count_ip,campaign_id,updated_at) VALUES('${ip_address}',${count},${campaignID}, now())`
          );

          const getreferrals = await pool.query(
            `INSERT INTO referrals (email, referrer_id, campaign_id) VALUES ('${email}', '${refer}', ${campaignID}) RETURNING *`
          );

          // customer creation data
          let camp_name = campaign_details.rows[0].name;
          let tags = `viral-launch, ${camp_name}`;

          const customerData = {
            first_name: "",
            last_name: "",
            email: email,
            phone: phone || "",
            verified_email: true,
            tags: tags,
            addresses: [
              {
                address1: "",
                city: "",
                province: "",
                phone: phone || "",
                zip: "",
                last_name: "",
                first_name: "",
                country: "",
              },
            ],
          };

          /* Check If Customer already exists in Database or App Store  */

          try {
            // if Not Exists on App Store or Database
            if (customerExists?.rowCount == 0 && findEmail === undefined) {

              let currentCustomerData = await createCustomer(shopSession, customerData);
              console.log("Customer Created Without Referral Code having Id: ", currentCustomerData.id);

            } else {
              // Update existing customer tags
              console.log("Customer already Exists with this Email: ", findEmail?.email);

              // -------------------------- More than one Campaign signups Based Customer Tags---------------------------

              let new_camp_name = campaign_details.rows[0].name;
              let newTag = `${new_camp_name}`;

                  const updatedCustomerData = {
                    id: findEmail.id,
                    tags: updatedTags,
                  };

                  await updateCustomer(shopSession, updatedCustomerData);
                  console.log('Customer Tags Updated Successfully - Customer Signed up for Another Campaign');
            }
          } catch (error) {
            console.log("Error Creating/Updating Customer", error);
            throwError;
          }

          referralcode = getreferrals.rows[0].referral_code;

          //prepare welcome email
          message = await replace_welcome_email_text(
            refererURL,
            campaign_details,
            shop,
            email
          );

          //send welcome email
          let send_message = await send_email(
            message,
            email,
            "You have Subscribed"
          );

          //check referrer code and send reward unlock email or referral email
          await find_referrer(refererURL, refer, campaign_details, shop);
        }
      }

      // console.log(referralcode);

      return res.status(307).json({ referral: referralcode });

      //   const queryObj = Object.assign({}, req.query);
      //   const { signature: _signature, hmac, ...map } = queryObj;

      //   const orderedMap = Object.keys(map)
      //     .sort((value1, value2) => value1.localeCompare(value2))
      //     .reduce((accum, key) => {
      //       accum[key] = map[key];
      //       return accum;
      //     }, {});

      //   const message = queryString.stringify(orderedMap);
      //   const generatedHash = crypto
      //     .createHmac('sha256', SHOPIFY_CLIENT_SECRET)
      //     .update(message)
      //     .digest('hex');

      //   // Safe Compare
      //   const aLen = Buffer.byteLength(generatedHash);
      //   const bLen = Buffer.byteLength(hmac);

      //   if (aLen !== bLen) {
      //     return res.status(400).send('HMAC validation failed');
      //   }

      //   // Turn strings into buffers with equal length
      //   // to avoid leaking the length
      //   const buffA = Buffer.alloc(aLen, 0, 'utf8');
      //   buffA.write(stringA);
      //   const buffB = Buffer.alloc(bLen, 0, 'utf8');
      //   buffB.write(stringB);

      //   const valid = crypto.timingSafeEqual(buffA, buffB);
      //   if (!valid) {
      //     return res.status(400).send('HMAC validation failed');
      //   }

      //   const formData = await Shopify.Utils.par;
      //   console.log(session);
      //   console.log(valid);
      //   const users = await pool.query('select * from users where email = $1', [
      //     session.id,
      //   ]);
      //   res.json(users.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  // get customer information for Shopify FrontEnd (Rewards Page)
  app.post("/api/get_referrals", async (req, res, next) => {
    try {
      const { referral_code, campaign_name } = req.body;
      const campaign_details = await pool.query(
        `SELECT * from campaign_settings where name=${campaign_name}`
      );
      const campaign_id = campaign_details?.rows[0]?.campaign_id;
      const data = await pool.query(
        "SELECT * FROM referrals WHERE referral_code=$1 and campaign_id=$2",
        [referral_code, campaign_id]
      );
      const data_ = await pool.query(
        "SELECT * FROM referrals WHERE referrer_id=$1",
        [data.rows[0].referral_code]
      );
      // console.log(data_.rows);
      if (data_.rows.length > 0) {
        return res.status(200).json({
          success: true,
          referral_data: data_.rows,
          campaign_data: campaign_details,
        });
      } else {
        return res.status(200).json({
          success: true,
          referral_data: [],
          campaign_data: campaign_details,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error });
    }
  });

  //Function for getting referrer details (Send referral email and reward unlock email if applicable)
  const find_referrer = async (refererURL, refer, campaign, shop) => {
    if (refer) {
      const referrer = await pool.query(
        `SELECT * FROM referrals WHERE referral_code='${refer}' and campaign_id=${campaign.rows[0].campaign_id}`
      );
      // console.log(referrer.rows);
      let referral_email_text = "";
      let reward_email_text = "";
      if (referrer.rows.length > 0) {
        let total_referrals = await pool.query(
          `SELECT * FROM referrals WHERE referrer_id='${refer}' and campaign_id=${campaign.rows[0].campaign_id}`
        );
        referral_email_text = await replace_referral_email_text(
          refererURL,
          campaign,
          shop,
          refer,
          total_referrals.rowCount
        );
        // console.log(referral_email_text);
        await send_email(
          referral_email_text,
          referrer.rows[0].email,
          "Friend has signed up"
        );
        let checker = null;
        if (total_referrals.rowCount == campaign.rows[0].reward_1_tier) {
          checker = "reward_1_tier";
        } else if (total_referrals.rowCount == campaign.rows[0].reward_2_tier) {
          checker = "reward_2_tier";
        } else if (total_referrals.rowCount == campaign.rows[0].reward_3_tier) {
          checker = "reward_3_tier";
        } else if (total_referrals.rowCount == campaign.rows[0].reward_4_tier) {
          checker = "reward_4_tier";
        }
        if (checker) {
          if (checker == "reward_1_tier") {
            reward_email_text = await replace_reward_email_text(
              refererURL,
              campaign,
              shop,
              refer,
              total_referrals.rowCount,
              campaign.rows[0].reward_1_code
            );
          } else if (checker == "reward_2_tier") {
            reward_email_text = await replace_reward_email_text(
              refererURL,
              campaign,
              shop,
              code,
              total_referrals.rowCount,
              campaign.rows[0].reward_2_code
            );
          } else if (checker == "reward_3_tier") {
            reward_email_text = await replace_reward_email_text(
              refererURL,
              campaign,
              shop,
              code,
              total_referrals.rowCount,
              campaign.rows[0].reward_3_code
            );
          } else if (checker == "reward_4_tier") {
            reward_email_text = await replace_reward_email_text(
              refererURL,
              campaign,
              shop,
              code,
              total_referrals.rowCount,
              campaign.rows[0].reward_4_code
            );
          }
          await send_email(
            reward_email_text,
            referrer.rows[0].email,
            "Reward Unlocked"
          );
        }
      }
    }
  };
}