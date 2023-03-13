import { Shopify } from '@shopify/shopify-api';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({

  connectionString: "postgres://postgres:postgres@localhost:5432/prelaunchdb",
});

pool.connect((err, result) => {
  if (err) throw err;
  console.log("Connected");
});

export default function campaignApiEndpoints(app) {
  //read all campaign

  app.get('/api/getcampaigns', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );

      const campaigns = await pool.query(
        'select * from campaign_settings where shop_id = $1 ',
        [session?.id]

        //  "select * from campaign_settings where shop_id = $1 ",
        //  [session?.shop]
      );
      res.json(campaigns.rows);
    } catch (err) {
      console.error(err);
    }
  });
  //get one campaign

  //create campaign
  app.post('/api/campaignsettings', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );
      const {
        collect_phone,
        discord_link,
        double_opt_in,
        double_opt_in_email,
        end_date,
        facebook_link,
        instagram_link,
        klaviyo_integration,
        klaviyo_list_id,
        name,
        product,
        referral_email,
        reward_1_code,
        reward_1_discount,
        reward_1_tier,
        reward_2_code,
        reward_2_discount,
        reward_2_tier,
        reward_3_code,
        reward_3_discount,
        reward_3_tier,
        reward_4_code,
        reward_4_discount,
        reward_4_tier,
        reward_email,
        share_discord_message,
        share_discord_referral,
        share_email_message,
        share_email_referral,
        share_facebook_message,
        share_facebook_referral,
        share_instagram_message,
        share_instagram_referral,
        share_snapchat_message,
        share_snapchat_referral,
        share_tiktok_message,
        share_tiktok_referral,
        share_twitter_message,
        share_twitter_referral,
        share_whatsapp_message,
        share_whatsapp_referral,
        show_discord_link,
        show_facebook_link,
        show_instagram_link,
        show_snapchat_link,
        show_tiktok_link,
        show_twitter_link,
        snapchat_link,
        start_date,
        tiktok_link,
        twitter_link,
        welcome_email,
        template_id,
        discount_type,
      } = req.body;
      const campaigns = await pool.query(
        `INSERT INTO campaign_settings (
          collect_phone, discord_link, double_opt_in, double_opt_in_email, end_date, facebook_link, instagram_link, klaviyo_integration, klaviyo_list_id, name, product, referral_email, reward_1_code, reward_1_discount, reward_1_tier, reward_2_code, reward_2_discount, reward_2_tier, reward_3_code, reward_3_discount, reward_3_tier, reward_4_code, reward_4_discount, reward_4_tier, reward_email, share_discord_message, share_discord_referral, share_email_message, share_email_referral, share_facebook_message, share_facebook_referral, share_instagram_message, share_instagram_referral, share_snapchat_message, share_snapchat_referral, share_tiktok_message, share_tiktok_referral, share_twitter_message, share_twitter_referral, share_whatsapp_message, share_whatsapp_referral, show_discord_link, show_facebook_link, show_instagram_link, show_snapchat_link, show_tiktok_link, show_twitter_link, snapchat_link, start_date, tiktok_link, twitter_link, welcome_email, template_id, discount_type ,shop_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55)
        `,
        [
          collect_phone,
          discord_link,
          double_opt_in,
          double_opt_in_email,
          end_date,
          facebook_link,
          instagram_link,
          klaviyo_integration,
          klaviyo_list_id,
          name,
          product,
          referral_email,
          reward_1_code,
          reward_1_discount,
          reward_1_tier,
          reward_2_code,
          reward_2_discount,
          reward_2_tier,
          reward_3_code,
          reward_3_discount,
          reward_3_tier,
          reward_4_code,
          reward_4_discount,
          reward_4_tier,
          reward_email,
          share_discord_message,
          share_discord_referral,
          share_email_message,
          share_email_referral,
          share_facebook_message,
          share_facebook_referral,
          share_instagram_message,
          share_instagram_referral,
          share_snapchat_message,
          share_snapchat_referral,
          share_tiktok_message,
          share_tiktok_referral,
          share_twitter_message,
          share_twitter_referral,
          share_whatsapp_message,
          share_whatsapp_referral,
          show_discord_link,
          show_facebook_link,
          show_instagram_link,
          show_snapchat_link,
          show_tiktok_link,
          show_twitter_link,
          snapchat_link,
          start_date,
          tiktok_link,
          twitter_link,
          welcome_email,
          template_id,
          discount_type,
          session?.shop,
        ]
      );
      res.json(campaigns.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  //update campaign

  app.put('/api/campaignsettings/:campaign_id', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );
      const { campaign_id } = req.params;
      const {
        collect_phone,
        discord_link,
        double_opt_in,
        double_opt_in_email,
        end_date,
        facebook_link,
        instagram_link,
        klaviyo_integration,
        klaviyo_list_id,
        name,
        product,
        referral_email,
        reward_1_code,
        reward_1_discount,
        reward_1_tier,
        reward_2_code,
        reward_2_discount,
        reward_2_tier,
        reward_3_code,
        reward_3_discount,
        reward_3_tier,
        reward_4_code,
        reward_4_discount,
        reward_4_tier,
        reward_email,
        share_discord_message,
        share_discord_referral,
        share_email_message,
        share_email_referral,
        share_facebook_message,
        share_facebook_referral,
        share_instagram_message,
        share_instagram_referral,
        share_snapchat_message,
        share_snapchat_referral,
        share_tiktok_message,
        share_tiktok_referral,
        share_twitter_message,
        share_twitter_referral,
        share_whatsapp_message,
        share_whatsapp_referral,
        show_discord_link,
        show_facebook_link,
        show_instagram_link,
        show_snapchat_link,
        show_tiktok_link,
        show_twitter_link,
        snapchat_link,
        start_date,
        tiktok_link,
        twitter_link,
        welcome_email,
        template_id,
        discount_type,
      } = req.body;
      const campaigns = await pool.query(
        `UPDATE campaign_settings SET 
          collect_phone =$1, 
          discord_link =$2, 
          double_opt_in =$3,
          double_opt_in_email  =$4, 
          end_date  =$5, 
          facebook_link =$6, 
          instagram_link =$7, 
          klaviyo_integration =$8, 
          klaviyo_list_id =$9, 
          name =$10, 
          product =$11,
          referral_email =$12, 
          reward_1_code =$13, 
          reward_1_discount =$14, 
          reward_1_tier =$15, 
          reward_2_code =$16, 
          reward_2_discount =$17, 
          reward_2_tier =$18, 
          reward_3_code =$19, 
          reward_3_discount =$20, 
          reward_3_tier =$21, 
          reward_4_code =$22, 
          reward_4_discount =$23, 
          reward_4_tier =$24, 
          reward_email =$25, 
          share_discord_message =$26,
          share_discord_referral =$27,
          share_email_message =$28, 
          share_email_referral =$29, 
          share_facebook_message =$30, 
          share_facebook_referral =$31,
          share_instagram_message =$32, 
          share_instagram_referral=$33, 
          share_snapchat_message=$34, 
          share_snapchat_referral=$35, 
          share_tiktok_message=$36, 
          share_tiktok_referral=$37,
          share_twitter_message=$38, 
          share_twitter_referral=$39, 
          share_whatsapp_message=$40, 
          share_whatsapp_referral=$41,
          show_discord_link=$42, 
          show_facebook_link=$43,
          show_instagram_link=$44, 
          show_snapchat_link=$45, 
          show_tiktok_link=$46, 
          show_twitter_link=$47, 
          snapchat_link=$48, 
          start_date=$49, 
          tiktok_link=$50,
          twitter_link=$51, 
          welcome_email=$52,
          template_id=$53, 
          discount_type =$54
          WHERE 
          campaign_id =$55 
          AND 
             shop_id= $56
             Returning*
        `,
        [
          collect_phone,
          discord_link,
          double_opt_in,
          double_opt_in_email,
          end_date,
          facebook_link,
          instagram_link,
          klaviyo_integration,
          klaviyo_list_id,
          name,
          product,
          referral_email,
          reward_1_code,
          reward_1_discount,
          reward_1_tier,
          reward_2_code,
          reward_2_discount,
          reward_2_tier,
          reward_3_code,
          reward_3_discount,
          reward_3_tier,
          reward_4_code,
          reward_4_discount,
          reward_4_tier,
          reward_email,
          share_discord_message,
          share_discord_referral,
          share_email_message,
          share_email_referral,
          share_facebook_message,
          share_facebook_referral,
          share_instagram_message,
          share_instagram_referral,
          share_snapchat_message,
          share_snapchat_referral,
          share_tiktok_message,
          share_tiktok_referral,
          share_twitter_message,
          share_twitter_referral,
          share_whatsapp_message,
          share_whatsapp_referral,
          show_discord_link,
          show_facebook_link,
          show_instagram_link,
          show_snapchat_link,
          show_tiktok_link,
          show_twitter_link,
          snapchat_link,
          start_date,
          tiktok_link,
          twitter_link,
          welcome_email,
          template_id,
          discount_type,
          campaign_id,
          session?.shop,
        ]
      );

      res.send(campaigns.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  //delete campaign

  app.delete('/api/campaignsettings/:campaign_id', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );
      const { campaign_id } = req.params;
      const campaigns = await pool.query(
        `DELETE FROM campaign_settings WHERE campaign_id =$1 AND shop_id= $2 RETURNING campaign_id`,
        [campaign_id, session?.shop]
      );

      res.send(campaigns?.rows);
    } catch (err) {
      console.error(err);
    }
  });
}
