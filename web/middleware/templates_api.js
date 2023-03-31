import { Shopify } from '@shopify/shopify-api';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

pool.connect((err, result) => {
  if (err) throw err;
  console.log('Connected');
});

export default function templatesApiEndpoints(app) {
  //read all campaign

  app.get('/api/templates', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );

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

      const result = {
        reward_page: reward_page.rows,
        templates: templates.rows,
      };

      const combinedData = templates.rows.map((template, index) => {
        const rewardPage = reward_page.rows[index];
        return {
          id: template.id,
          // rewards_page_template_columns
          rewards_page_id: rewardPage.id,
          rewards_template_id: rewardPage.rewards_template_id,
          campaign_image: rewardPage.campaign_image,
          show_header_footer: rewardPage.show_header_footer,
          background_image: rewardPage.background_image,
          base_text_size: rewardPage.base_text_size,
          pre_header_text: rewardPage.pre_header_text,
          header_text: rewardPage.header_text,
          sub_header_text: rewardPage.sub_header_tex,
          first_page: rewardPage.first_page,
          rewards_image: rewardPage.rewards_image,
          main_color: rewardPage.main_color,
          accent_color: rewardPage.accent_color,
          referral_position: rewardPage.referral_position,
          reward_position: rewardPage.reward_position,
          divider: rewardPage.divider,
          campaign_name: rewardPage.campaign_name,
          background_overlay: rewardPage.background_overlay,

          // Landing_page_template data
          landing_template_id: template.landing_template_id,
          landing_campaign_image: template.campaign_image,
          landing_first_page: template.first_page,
          landing_show_header_footer: template.show_header_footer,
          landing_background_image: template.background_image,
          landing_base_text_size: template.base_text_size,
          landing_header_text: template.header_text,
          landing_sub_header_text: template.sub_header_text,
          landing_first_page: template.first_page,
          landing_main_color: template.main_color,
          landing_accent_color: template.accent_color,
          landing_divider: template.divider,
          landing_campaign_name: template.campaign_name,
          landing_background_overlay: template.background_overlay,
          landing_tag_line_text: template.tag_line_text,
          landing_button_text: template.button_text,
          landing_email_placeholder_text: template.email_placeholder_text,
          landing_second_page: template.seconde_page,
          landing_text_position: template.text_position,
          landing_input_position: template.input_position,
          landing_phone_placeholder_text: template.phone_placeholder,
        };
      });

      // console.log(combinedData);

      res.json(combinedData);
    } catch (err) {
      console.error(err);
    }
  });
}
