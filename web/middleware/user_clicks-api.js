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
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;

      // overall clicks
      const total_clicks = await pool.query(
        `WITH UserClicks AS (
          SELECT
          uc.campaign_id,
          COUNT(uc.id) AS campaign_clicks
          FROM user_clicks uc 
          WHERE shop = $1
          GROUP BY uc.campaign_id
        )
        SELECT 
        campaign_id,
        campaign_clicks, 
        SUM(campaign_clicks) OVER() AS total_clicks
        FROM UserClicks`, 
        [shop]
      );
      
      // console.log('user clicks: ', total_clicks.rows);
      return res.status(200).json(total_clicks.rows);
    } catch (error) {
      return res.status(500).json({ success: false, error: error});
    }
  });

  // fetch user clicks of last six months of all campaigns 
  app.get("/api/fetch_lastsixmonths_clicks", async (req, res) => {
    try {
      // console.log("I am here in fetch last six months clicks API");
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;
      const lastsixmonths_clicks = await pool.query(
        `SELECT COUNT(id) AS total_months_clicks, 
        to_char(created_at, 'YYYY-MM') AS created_month 
        FROM user_clicks 
        WHERE created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '6 months' 
        AND created_at < date_trunc('month', CURRENT_DATE) 
        AND shop = $1 
        GROUP BY created_month 
        ORDER BY created_month DESC`, 
        [shop]
      );
      // console.log('user clicks of last six months: ', lastsixmonths_clicks);
      // console.log(lastsixmonths_clicks.rows);
      return res.status(200).json(lastsixmonths_clicks.rows);
    } catch (error) {
      return res.status(500).json({ success: false, error: error});
    }
  });

  // fetch user clicks of last four campaigns 
  app.get("/api/fetch_lastfourcampaigns_clicks", async (req, res) => {
    try {
      // console.log("I am here in fetch lst four campaigns clicks API");
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { shop } = session;

      const lastfourcampaigns_clicks = await pool.query(
        `WITH CampaignClicks AS (
          SELECT cs.campaign_id, cs.name, cs.start_date,
          COUNT(uc.id) AS campaign_clicks, cs.shop_id
          FROM campaign_settings cs
          LEFT JOIN user_clicks uc ON cs.campaign_id = uc.campaign_id AND cs.shop_id = uc.shop
          WHERE uc.shop = $1
          AND cs.is_deleted = false
          AND cs.start_date <= CURRENT_TIMESTAMP
          GROUP BY cs.campaign_id, cs.shop_id
          ORDER BY cs.start_date DESC
          LIMIT 4
        )
        SELECT campaign_id, name, start_date, campaign_clicks, 
        SUM(campaign_clicks) OVER() AS total_fourcampaigns_clicks
        FROM CampaignClicks
        ORDER BY start_date DESC;`,
        [shop]
      )
      // console.log('user clicks of last six months: ', lastsixmonths_clicks);
      // console.log(lastfourcampaigns_clicks.rows);
      return res.status(200).json(lastfourcampaigns_clicks.rows);
    } catch (error) {
      return res.status(500).json({ success: false, error: error});
    }
  });
}
