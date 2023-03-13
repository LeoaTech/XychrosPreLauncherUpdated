import { Shopify } from "@shopify/shopify-api";

//import { db } from '../prelauncherDB.js';
import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/prelaunchdb",
});

pool.connect((err, result) => {
  if (err) throw err;
  console.log("Konsi DB hai Connected");
});

export default function globalSettingsApiEndPoint(app) {
  //read Global setting for the shop id

  app.get("/api/updatesettings", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const findSettings = await pool.query(
        `select * from global_settings where id = $1 `,[1]
        // ,
        // [session?.id]
      );

      // console.log(findSettings.rows);
      res.json(findSettings.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  // Insert new settings
 /*  app.post("/api/updatesettings", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const {
        facebook_link,
        instagram_link,
        discord_link,
        snapchat_link,
        tiktok_link,
        twitter_link,
        show_discord_link,
        show_twitter_link,
        show_snapchat_link,
        show_facebook_link,
        show_tiktok_link,
        show_instagram_link,
        collect_phone,
        share_facebook_message,
        share_facebook_referral,
        share_instagram_message,
        share_instagram_referral,
        share_discord_message,
        share_discord_referral,
        share_snapchat_message,
        share_snapchat_referral,
        share_tiktok_message,
        share_tiktok_referral,
        share_twitter_message,
        share_twitter_referral,
        share_whatsapp_message,
        share_whatsapp_referral,
        share_email_message,
        share_email_referral,
        discount_type,
        reward_1_code,
        reward_1_discount,
        reward_1_tier,
        reward_2_code,
        reward_2_tier,
        reward_2_discount,
        reward_3_code,
        reward_3_discount,
        reward_3_tier,
        reward_4_code,
        reward_4_tier,
        reward_4_discount,
        double_opt_in,
        double_opt_in_email,
        reward_email,
        welcome_email,
        referral_email,
        klaviyo_Integration,
        klaviyo_api_key,
        templates,
      } = req.body;
      const settings = await pool.query(
        `INSERT INTO global_settings (
          shop_id,
          facebook_link,
          instagram_link,
          discord_link,
          snapchat_link,
          tiktok_link,
          twitter_link,
          show_discord_link,
          show_twitter_link,
          show_snapchat_link,
          show_facebook_link,
          show_tiktok_link,
          show_instagram_link,
          collect_phone,
          share_facebook_message,
          share_facebook_referral,
          share_instagram_message,
          share_instagram_referral,
          share_discord_message,
          share_discord_referral,
          share_snapchat_message,
          share_snapchat_referral,
          share_tiktok_message,
          share_tiktok_referral,
          share_twitter_message,
          share_twitter_referral,
          share_whatsapp_message,
          share_whatsapp_referral,
          share_email_message,
          share_email_referral,
          discount_type,reward_1_code,
          reward_1_discount,
          reward_1_tier,
          reward_2_code,
          reward_2_tier,
          reward_2_discount,
          reward_3_code,
          reward_3_discount,
          reward_3_tier,
          reward_4_code,
          reward_4_tier,
          reward_4_discount,
          double_opt_in,
          double_opt_in_email,
          reward_email,
          welcome_email,
          referral_email,
          klaviyo_Integration,
          klaviyo_api_key,
          templates
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
          $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,$51
        )`,
        [
          "razaa-dev.myshopify.com",
          facebook_link,
          instagram_link,
          discord_link,
          snapchat_link,
          tiktok_link,
          twitter_link,
          show_discord_link,
          show_twitter_link,
          show_snapchat_link,
          show_facebook_link,
          show_tiktok_link,
          show_instagram_link,
          collect_phone,
          share_facebook_message,
          share_facebook_referral,
          share_instagram_message,
          share_instagram_referral,
          share_discord_message,
          share_discord_referral,
          share_snapchat_message,
          share_snapchat_referral,
          share_tiktok_message,
          share_tiktok_referral,
          share_twitter_message,
          share_twitter_referral,
          share_whatsapp_message,
          share_whatsapp_referral,
          share_email_message,
          share_email_referral,
          discount_type,
          reward_1_code,
          reward_1_discount,
          reward_1_tier,
          reward_2_code,
          reward_2_tier,
          reward_2_discount,
          reward_3_code,
          reward_3_discount,
          reward_3_tier,
          reward_4_code,
          reward_4_tier,
          reward_4_discount,
          double_opt_in,
          double_opt_in_email,
          reward_email,
          welcome_email,
          referral_email,
          klaviyo_Integration,
          klaviyo_api_key,
          templates,
        ]
      );
      // console.log("data",settings);
      res.json(settings);
    } catch (err) {
      console.error(err.message);
    }
  }); */

  //update Settings at shop_id
  app.put("/api/updatesettings", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const {
        facebook_link,
        instagram_link,
        discord_link,
        snapchat_link,
        tiktok_link,
        twitter_link,
        show_discord_link,
        show_twitter_link,
        show_snapchat_link,
        show_facebook_link,
        show_tiktok_link,
        show_instagram_link,
        collect_phone,
        share_facebook_message,
        share_facebook_referral,
        share_instagram_message,
        share_instagram_referral,
        share_discord_message,
        share_discord_referral,
        share_snapchat_message,
        share_snapchat_referral,
        share_tiktok_message,
        share_tiktok_referral,
        share_twitter_message,
        share_twitter_referral,
        share_whatsapp_message,
        share_whatsapp_referral,
        share_email_message,
        share_email_referral,
        discount_type,
        reward_1_code,
        reward_1_discount,
        reward_1_tier,
        reward_2_code,
        reward_2_tier,
        reward_2_discount,
        reward_3_code,
        reward_3_discount,
        reward_3_tier,
        reward_4_code,
        reward_4_tier,
        reward_4_discount,
        double_opt_in,
        double_opt_in_email,
        reward_email,
        welcome_email,
        referral_email,
        klaviyo_Integration,
        klaviyo_api_key,
        templates,
      } = req.body;

      const settings = await pool.query(
        `UPDATE global_settings SET
          facebook_link = $1,
          instagram_link = $2,
          discord_link =$3,
          snapchat_link=$4,
          tiktok_link=$5,
          twitter_link=$6,
          show_discord_link =$7,
          show_twitter_link=$8,
          show_snapchat_link=$9,
          show_facebook_link=$10,
          show_tiktok_link=$11,
          show_instagram_link=$12,
          collect_phone=$13,
          share_facebook_message=$14,
          share_facebook_referral=$15,
          share_instagram_message=$16,
          share_instagram_referral=$17,
          share_discord_message=$18,
          share_discord_referral=$19,
          share_snapchat_message=$20,
          share_snapchat_referral=$21,
          share_tiktok_message=$22,
          share_tiktok_referral=$23,
          share_twitter_message=$24,
          share_twitter_referral=$25,
          share_whatsapp_message=$26,
          share_whatsapp_referral=$27,
          share_email_message=$28,
          share_email_referral=$29,
          discount_type=$30,
          reward_1_code=$31,
          reward_1_discount=$32,
          reward_1_tier=$33,
          reward_2_code=$34,
          reward_2_tier=$35,
          reward_2_discount=$36,
          reward_3_code=$37,
          reward_3_discount=$38,
          reward_3_tier=$39,
          reward_4_code=$40,
          reward_4_tier=$41,
          reward_4_discount=$42,
          double_opt_in=$43,
          double_opt_in_email=$44,
          reward_email=$45,
          welcome_email=$46,
          referral_email=$47,
          klaviyo_Integration=$48,
          klaviyo_api_key=$49,
          templates=$50
        WHERE
          shop_id = $51`,
        [
          facebook_link,
          instagram_link,
          discord_link,
          snapchat_link,
          tiktok_link,
          twitter_link,
          show_discord_link,
          show_twitter_link,
          show_snapchat_link,
          show_facebook_link,
          show_tiktok_link,
          show_instagram_link,
          collect_phone,
          share_facebook_message,
          share_facebook_referral,
          share_instagram_message,
          share_instagram_referral,
          share_discord_message,
          share_discord_referral,
          share_snapchat_message,
          share_snapchat_referral,
          share_tiktok_message,
          share_tiktok_referral,
          share_twitter_message,
          share_twitter_referral,
          share_whatsapp_message,
          share_whatsapp_referral,
          share_email_message,
          share_email_referral,
          discount_type,
          reward_1_code,
          reward_1_discount,
          reward_1_tier,
          reward_2_code,
          reward_2_tier,
          reward_2_discount,
          reward_3_code,
          reward_3_discount,
          reward_3_tier,
          reward_4_code,
          reward_4_tier,
          reward_4_discount,
          double_opt_in,
          double_opt_in_email,
          reward_email,
          welcome_email,
          referral_email,
          klaviyo_Integration,
          klaviyo_api_key,
          templates,
          session?.id,
        ]
      );

      console.log(settings);
      // res.json(settings.rowCount);
    } catch (err) {
      console.error(err.message);
    }
  });
}