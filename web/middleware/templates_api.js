import { Shopify } from "@shopify/shopify-api";

import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/prelauncher",
});

pool.connect((err, result) => {
  if (err) throw err;
  console.log("Connected");
});

export default function templatesApiEndpoints(app) {
  //read all campaign

  app.get("/api/templates", async (req, res) => {
    try {
      const reward_page = await pool.query(
        `
      SELECT 
    t.*, 
    trp.*
  FROM 
    templates t 
    JOIN template_rewards_page trp ON t.rewards_template_id = trp.id;
`
      );

      const templates = await pool.query(
        ` SELECT 
      tlr.*, 
      tlp.*
    FROM 
      (SELECT 
        t.*, 
        trp.*
      FROM 
        templates t 
        JOIN template_rewards_page trp ON t.rewards_template_id = trp.id) tlr
        JOIN template_landing_page tlp ON tlr.landing_template_id = tlp.id`
      );

      // const result = {
      //   reward_page: reward_page.rows,
      //   templates: templates.rows,
      // };

      const combinedData = templates.rows.map((template, index) => {
        const rewardPage = reward_page.rows[index];
        return {
          id: template?.id,
          // rewards_template_columns

          rewards_page_id: rewardPage?.id,
          rewards_template_id: rewardPage?.rewards_template_id,
          campaign_image: rewardPage?.campaign_image,
          rewards_show_header_footer: rewardPage?.show_header_footer,
          rewards_background_image: rewardPage?.background_image,
          rewards_base_text_size: rewardPage?.base_text_size,
          rewards_pre_header_text: rewardPage?.pre_header_text,
          rewards_header_text: rewardPage?.header_text,
          rewards_sub_header_text: rewardPage?.sub_header_text,
          first_page: rewardPage?.first_page,
          rewards_rewards_image: rewardPage?.rewards_image,
          rewards_main_color: rewardPage?.main_color,
          rewards_accent_color: rewardPage?.accent_color,
          rewards_referral_position: rewardPage?.referral_position,
          reward_position: rewardPage?.reward_position,
          rewards_divider: rewardPage?.divider,
          campaign_name: rewardPage?.campaign_name,
          rewards_background_overlay: rewardPage?.background_overlay,

          // Landing_template data
          landing_template_id: template?.landing_template_id,
          campaign_image: template?.campaign_image,
          landing_show_header_footer: template?.show_header_footer,
          landing_background_image: template?.background_image,
          landing_base_text_size: template?.base_text_size,
          landing_header_text: template?.header_text,
          landing_pre_header_text: template?.pre_header_text,
          landing_main_color: template?.main_color,
          landing_accent_color: template?.accent_color,
          landing_divider: template?.divider,
          campaign_name: template?.campaign_name,
          landing_background_overlay: template?.background_overlay,
          landing_tag_line_text: template?.tag_line_text,
          landing_button_text: template?.button_text,
          landing_email_placeholder_text: template?.email_placeholder_text,
          second_page: template?.second_page,
          landing_text_position: template?.text_position,
          landing_input_position: template?.input_position,
          landing_phone_placeholder_text: template?.phone_placeholder_text,
        };
      });

      return res.status(200).json(combinedData);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
}
