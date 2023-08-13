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
  console.log("Connected");
});

export default function getCampaignClicks(app, secret) {

  // count clicks of landing page 
  app.post("/api/getclicks", async (req, res) => {
    try {
      // console.log("I am here in count clicks API");
      // console.log(req.query);
      // console.log(req.body);
      const shop = req.query.shop;
      const campaign = req.body.campaign_name;

      let campaign_data = await pool.query(
        "SELECT * FROM campaign_settings WHERE name=$1",
        [campaign]
      );
      // console.log(campaign_data);

      if (campaign_data.rowCount > 0) {
        await pool.query(
          "INSERT INTO user_clicks(campaign_id, shop) VALUES($1, $2)",
          [campaign_data.rows[0].campaign_id, shop]
        );
        return res.status(200).json({ success: true, message: "Successully Updated Clicks Table" });
      } else {
        return res.status(404).json({ success: false, message: "Campaign Not Found" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  });

  // fetch total user clicks of all campaigns 
  app.get("/api/fetchtotalclicks", async (req, res) => {
    try {
      // console.log("I am here in fetch clicks API");
      // console.log(req.query);
      // console.log(req.body);
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;
      const total_clicks = await pool.query(
        "SELECT * FROM user_clicks WHERE shop=$1", 
        [shop]
      );
      // console.log('user clicks: ', total_clicks.rowCount);
      return res.status(200).json(total_clicks.rowCount);
    } catch (error) {
      return res.status(500).json({ success: false, error: error});
    }
  });

// fetch user clicks of last six months of all campaigns 
  app.get("/api/fetch_lastsixmonths_clicks", async (req, res) => {
    try {
      // console.log("I am here in fetch clicks API");
      // console.log(req.query);
      // console.log(req.body);
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;
      const lastsixmonths_clicks = await pool.query(
        "SELECT COUNT(id) AS total_clicks, to_char(created_at, 'YYYY-MM') AS created_month FROM user_clicks WHERE created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '6 months' AND created_at < date_trunc('month', CURRENT_DATE) AND shop = $1 GROUP BY created_month ORDER BY created_month ASC;", 
        [shop]
      );
      // console.log('user clicks of last six months: ', lastsixmonths_clicks);
      console.log(lastsixmonths_clicks.rows);
      return res.status(200).json(lastsixmonths_clicks.rows);
    } catch (error) {
      return res.status(500).json({ success: false, error: error});
    }
  });
}
