import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import emailValidator from "deep-email-validator";
// import { sendemail } from "../utils/sendEmail.js";
import { sendemail } from "../utils/sendEmail.js";
import {
  replace_welcome_email_text,
} from "../utils/replace_email_text.js";

export const get_store_referrals = async (req, res, next) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const { id } = session;
    const data = await pool.query(
      "SELECT referrals.email,referrals.referral_code,campaign_settings.name,referrals.created_at FROM campaign_settings INNER JOIN referrals ON campaign_settings.campaign_id = referrals.campaign_id AND campaign_settings.shop_id=$1",
      [id]
    );
    let data_ = [];
    let number = 1;
    for (let i = 0; i < data.rowCount; i++) {
      const user_referrals = await pool.query(
        "SELECT * FROM referrals WHERE referrer_id=$1",
        [data.rows[i].referral_code]
      );
      data_.push({
        email: data.rows[i].email,
        referral_code: data.rows[i].referral_code,
        total_friends: user_referrals.rowCount,
        campaign_name: data.rows[i].name,
        created_at: data.rows[i].created_at,
        id: number,
      });
      number += 1;
    }
    if (data.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: data_,
        total_referrals: data_.length,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: data_,
        total_referrals: data_.length,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const check_email = async (req, res, next) => {
  try {
    const { email, campaign_id } = req.body;
    let { code } = req.body;
    if (code) {
      code = code.split("=")[1];
    }
    const { shop, email, refer } = req.query;
    let campaign_id = 1;
    let code = refer;
    let message = "";
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
    let campaign = await pool.query(
      "SELECT * FROM campaign_settings WHERE campaign_id=$1",
      [campaign_id]
    );
    if (check_email.rows.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "You are logged in" });
      return res.status(200).json({
        success: true,
        message: "You are logged in",
        referral_code: check_email.rows[0].referral_code,
      });
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
          data = await pool.query("SELECT * FROM referrals WHERE email=$1", [
            email,
          ]);
          message = campaign.rows[0].welcome_email;
          message = await replace_welcome_email_text(
            message,
            campaign,
            shop,
            email
          );
          await send_email(message, email, "Account Created");
          await get_user(code, email, campaign, shop);
          return res.status(200).json({
            success: true,
            message: "Your ip has been added again",
            referral_code: data.rows[0].referral_code,
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
        data = await pool.query("SELECT * FROM referrals WHERE email=$1", [
          email,
        ]);
        message = campaign.rows[0].welcome_email;
        message = await replace_welcome_email_text(
          message,
          campaign,
          shop,
          email
        );
        await send_email(message, email, "Account Created");
        await get_user(code, email, campaign, shop);
        return res.status(200).json({
          success: true,
          message: "Your ip has been added successfully",
          referral_code: data.rows[0].referral_code,
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
const get_user = async (code, email, campaign, shop) => {
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
        code,
        email,
      ]);
      let total_referrals = await pool.query(
        "SELECT * FROM referrals WHERE referrer_id=$1",
        [get_user.rows[0].referral_code]
      );
      let referral_email_text = campaign.rows[0].referral_email;
      let reward_email_text = campaign.rows[0].reward_email;
      referral_email_text = await replace_referral_email_text(
        referral_email_text,
        campaign,
        shop,
        code,
        total_referrals.rowCount
      );
      await send_email(
        referral_email_text,
        get_user.rows[0].email,
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
            reward_email_text,
            campaign,
            shop,
            code,
            total_referrals.rowCount,
            campaign.rows[0].reward_1_code
          );
        } else if (checker == "reward_2_tier") {
          reward_email_text = await replace_reward_email_text(
            reward_email_text,
            campaign,
            shop,
            code,
            total_referrals.rowCount,
            campaign.rows[0].reward_2_code
          );
        } else if (checker == "reward_3_tier") {
          reward_email_text = await replace_reward_email_text(
            reward_email_text,
            campaign,
            shop,
            code,
            total_referrals.rowCount,
            campaign.rows[0].reward_3_code
          );
        } else if (checker == "reward_4_tier") {
          reward_email_text = await replace_reward_email_text(
            reward_email_text,
            campaign,
            shop,
            code,
            total_referrals.rowCount,
            campaign.rows[0].reward_4_code
          );
        }
        await send_email(
          reward_email_text,
          get_user.rows[0].email,
          "Reward Unlocked"
        );
      }
    }
  }
};

export const get_user_referral_code = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await pool.query("SELECT * FROM referrals WHERE email=$1", [
      email,
    ]);
    const { referral_code } = req.body;
    const data = await pool.query(
      "SELECT * FROM referrals WHERE referral_code=$1",
      [referral_code]
    );
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

export const get_referrals = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(req.query);
    const data = await pool.query("SELECT * FROM referrals WHERE email=$1", [
      email,
    ]);
    const { referral_code } = req.body;
    const data = await pool.query(
      "SELECT * FROM referrals WHERE referral_code=$1",
      [referral_code]
    );
    const data_ = await pool.query(
      "SELECT * FROM referrals WHERE referrer_id=$1",
      [data.rows[0].referral_code]
    );
    if (data_.rows.length > 0) {
      return res.status(200).json({ success: true, message: data_.rows });
    } else {
      return res.status(200).json({ success: true, message: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const send_email = async (message, email, subject) => {
  try {
    await sendemail({
      to: email,
      subject: subject,
      text: message,
    });
  } catch (error) {
    console.log(error);
  }
};
