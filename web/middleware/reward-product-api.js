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

export default function campaignProductsDetailsApiEndpoints(app) {
  //read all campaigns Products Details

  app.get("/api/campaign-product-details", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      return res.status(200).json({ message: "No data found" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });

  // Save Free Product Reward Tiers Details
  app.post("/api/campaign-product-details", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const {
        campaign_id,
        discount_type,
        launchProductTitle,
        launchProductId,
        tier1ProductName,
        tier1ProductId,
        tier2ProductName,
        tier2ProductId,
        tier3ProductName,
        tier3ProductId,
        tier4ProductName,
        tier4ProductId,
        reward_tier1_referrals,
        reward_tier2_referrals,
        reward_tier3_referrals,
        reward_tier4_referrals,
      } = req.body;

      const campaignExists = await pool.query(
        `select * from campaign_settings where campaign_id = $1`,
        [campaign_id]
      );

      if (campaignExists?.rowCount > 0) {
        try {
          const query = `
          INSERT INTO campaign_product_details(
            campaign_id,
            discount_type,
            launch_product_title,
            launch_product_id,
            tier1_product_name,
            tier1_product_id,
            tier2_product_name,
            tier2_product_id,
            tier3_product_name,
            tier3_product_id,
            tier4_product_name,
            tier4_product_id,
            reward_tier1_referrals,
            reward_tier2_referrals,
            reward_tier3_referrals,
            reward_tier4_referrals
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *
          `;

          const campaignsProducts = await pool.query(query, [
            campaign_id,
            discount_type,
            launchProductTitle,
            launchProductId,
            tier1ProductName,
            tier1ProductId,
            tier2ProductName,
            tier2ProductId,
            tier3ProductName,
            tier3ProductId,
            tier4ProductName,
            tier4ProductId,
            reward_tier1_referrals,
            reward_tier2_referrals,
            reward_tier3_referrals,
            reward_tier4_referrals
          ]);


          console.log(campaignsProducts?.rows[0]);

          return res.status(201).json(campaignsProducts?.rows);
        } catch (err) {
          console.log(err, "Campaign products returned error: ");
        }
      } else {
        return res.json({ message: "Campaign not exists" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
