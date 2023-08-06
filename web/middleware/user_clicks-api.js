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

export default function getCampaignClicks(app) {
  app.post("/api/getclicks", async (req, res) => {
    try {
      console.log("I am here in get clicks API");
      console.log(req.query);
      console.log(req.body);
      const shop = req.query.shop;
      const campaign = req.body.campaign_name;

      let campaign_data = await pool.query(
        "SELECT * FROM campaign_settings WHERE name=$1",
        [campaign]
      );
      console.log(campaign_data);

      if (campaign.rowCount > 0) {
        await pool.query(
          "INSERT INTO clicks(campaign_id, shop) VALUES($1,$2)",
          [campaign.rows[0].campaign_id, shop]
        );
        return res.status(200).json({ success: true, message: "Success" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Campaign Not Found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error Occured" });
    }
  });
}
