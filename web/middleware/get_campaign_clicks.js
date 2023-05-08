import { Shopify } from "@shopify/shopify-api";

import NewPool from "pg";
const { Pool } = NewPool;

const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

pool.connect((err, result) => {
  if (err) throw err;
  console.log("Connected");
});

export default function getCampaignClicks(app) {
  app.get("/api/getClicks", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { id, shop } = session;
      const data = await pool.query("SELECT * FROM clicks WHERE shop=$1", [
        shop,
      ]);
      return res.status(200).json({ success: true, clicks: data.rowCount });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error occured" });
    }
  });
  app.post("/api/updatecampaigns", async (req, res) => {
    try {
      const { campaign_name } = req.body;
      const { shop } = req.query;
      let campaign = await pool.query(
        "SELECT * FROM campaign_settings WHERE name=$1",
        [campaign_name]
      );
      if (campaign.rowCount > 0) {
        await pool.query("INSERT INTO clicks(campaign_id,shop) VALUES($1,$2)", [
          campaign.rows[0].campaign_id,
          shop,
        ]);
        return res.status(200).json({ success: true, message: "Success" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Campaign not found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server error occured" });
    }
  });
}
