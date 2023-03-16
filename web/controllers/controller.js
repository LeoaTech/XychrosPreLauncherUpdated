import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import emailValidator from "deep-email-validator";
import { sendemail } from "../utils/sendEmail.js";
export const check_email = async (req, res, next) => {
  try {
    const { email, campaign_id } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide valid input" });
    }
    let isemail_valid = await emailValidator.validate(email);
    if (isemail_valid.validators.smtp.valid == false) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide a valid email" });
    }
    let check_email = await pool.query(
      "SELECT * FROM referrals WHERE email=$1",
      [email]
    );
    if (check_email.rows.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "You are logged in" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
