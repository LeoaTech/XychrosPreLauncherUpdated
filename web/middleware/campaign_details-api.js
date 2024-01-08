import { Shopify } from "@shopify/shopify-api";
import NewPool from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

pool.connect((err, result) => {
  if (err) throw err;
});

export default function campaignDetailsApiEndpoints(app) {
  //read all campaigns Details

  app.get("/api/campaigndetails", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const campaigns = await pool.query(
        `SELECT cs.*,
        cd.is_active, cd.is_draft, cd.landing_page_link, cd.rewards_page_link, cd.landing_template_link, cd.rewards_template_link,
        cp.tier1_product_name, cp.tier2_product_name, cp.tier3_product_name, cp.tier4_product_name
 FROM campaign_settings cs
 LEFT JOIN campaign_details cd ON cs.campaign_id = cd.campaign_id
 LEFT JOIN campaign_product_details cp ON cs.campaign_id = cp.campaign_id
 where cs.shop_id = $1`,
        [session?.shop]
      );

      return res.status(200).json(campaigns?.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
  //get one campaign

  //create campaign
  app.post("/api/campaigndetails", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const {
        campaign_name,
        theme_id,
        landing_template_key,
        landing_template_link,
        landing_page_id,
        landing_page_link,
        rewards_template_key,
        rewards_template_link,
        rewards_page_id,
        rewards_page_link,
        tier1_segment_id,
        tier2_segment_id,
        tier3_segment_id,
        tier4_segment_id,
        tier1_price_rule_id,
        tier2_price_rule_id,
        tier3_price_rule_id,
        tier4_price_rule_id,
        discount_code_1,
        discount_code_2,
        discount_code_3,
        discount_code_4,
        is_draft,
        is_active,
      } = req.body;

      let campaignID;
      const campaignExists = await pool.query(
        `select * from campaign_settings where name = $1`,
        [campaign_name]
      );

      if (campaignExists?.rowCount > 0) {
        campaignID = campaignExists?.rows[0]?.campaign_id;
        const query = `
          INSERT INTO campaign_details(
            campaign_id,
            is_draft,
            is_active,
            theme_id,
            landing_template_key,
            rewards_template_key,
            landing_page_id,
            rewards_page_id,
            landing_template_link,
            rewards_template_link,
            landing_page_link,
            rewards_page_link,
            tier1_segment_id,
            tier2_segment_id,
            tier3_segment_id,
            tier4_segment_id,
            tier1_price_rule_id,
            tier2_price_rule_id,
            tier3_price_rule_id,
            tier4_price_rule_id,
            discount_code_1,
            discount_code_2,
            discount_code_3,
            discount_code_4,
            shop_id
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING *
        `;

        const campaigns = await pool.query(query, [
          campaignID,
          is_draft,
          is_active,
          theme_id,
          landing_template_key,
          rewards_template_key,
          landing_page_id,
          rewards_page_id,
          landing_template_link,
          rewards_template_link,
          landing_page_link,
          rewards_page_link,
          tier1_segment_id,
          tier2_segment_id,
          tier3_segment_id,
          tier4_segment_id,
          tier1_price_rule_id,
          tier2_price_rule_id,
          tier3_price_rule_id,
          tier4_price_rule_id,
          discount_code_1,
          discount_code_2,
          discount_code_3,
          discount_code_4,
          session?.shop,
        ]);

        return res.status(201).json(campaigns.rows);
      } else {
        return res.json({ message: "Campaign not exists" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
