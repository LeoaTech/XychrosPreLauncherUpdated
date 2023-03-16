import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import emailValidator from "deep-email-validator";
import { sendemail } from "../utils/sendEmail.js";
export const check_email = async (req, res, next) => {
  try {
    const { email, campaign_id } = req.body;
    let { code } = req.body;
    if (code) {
      code = code.split("=")[1];
    }
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
    } else {
      let ip_address =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
      ip_address = ip_address.split(",")[0];
      let data = await pool.query(
        "SELECT * FROM ip_addresses WHERE address=$1",
        [ip_address]
      );
      let count = 1;
      if (data.rows.length > 0) {
        count = data.rows[0].count;
        if (count >= 2) {
          return res.status(400).json({
            success: false,
            message: "You have already requested 2 times",
          });
        } else {
          count = count + 1;
          await pool.query(
            `UPDATE ip_addresses SET count=$1 WHERE (address=$2)`,
            [count, ip_address]
          );
          await pool.query(
            "INSERT INTO referrals (email,campaign_id) VALUES($1,$2)",
            [email, campaign_id]
          );
          await get_user(code, email);
          return res.status(200).json({
            success: true,
            message: "Your ip has been added again",
          });
        }
      } else {
        data = await pool.query(
          "INSERT INTO ip_addresses (address,count,campaign_id) VALUES($1,$2,$3)",
          [ip_address, count, campaign_id]
        );
        await pool.query(
          "INSERT INTO referrals (email,campaign_id) VALUES($1,$2)",
          [email, campaign_id]
        );
        await get_user(code, email);
        return res.status(200).json({
          success: true,
          message: "Your ip has been added successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const get_user = async (code, email) => {
  if (code) {
    const get_user = await pool.query(
      "SELECT * FROM referrals WHERE referral_code=$1",
      [code]
    );
    if (get_user.rows.length > 0) {
      let reference_email = get_user.rows[0].email;
      let reference_code = get_user.rows[0].referral_code;
      await pool.query("UPDATE referrals SET referrer_id=$1 WHERE (email=$2)", [
        reference_code,
        email,
      ]);
    }
  }
};

export const get_user_referral_code = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await pool.query("SELECT * FROM referrals WHERE email=$1", [
      email,
    ]);
    if (data.rows.length > 0) {
      const code = data.rows[0].referral_code;
      return res.status(200).json({ success: true, message: code });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

