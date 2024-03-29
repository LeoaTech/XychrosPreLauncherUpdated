import { Shopify } from "@shopify/shopify-api";

import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

export default function referralsApiEndpoints(app, secret) {
  // get referrals for Merchant dashboard
  app.get("/api/getallreferralcount", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const referrals = await pool.query(
        // 'SELECT r.*, c.name as campaign_name FROM referrals r INNER JOIN campaign_settings c ON r.campaign_id = c.campaign_id WHERE c.shop_id = $1',
        ` SELECT r.referral_code, r.email, r.referrer_id, r.created_at, j.mycount AS friends_joined, r.campaign_id, c.name AS campaign_name
        FROM referrals r
        LEFT JOIN (
          SELECT referrer_id, COUNT(referrer_id) AS mycount
          FROM referrals
          GROUP BY referrer_id
        ) j ON r.referral_code = j.referrer_id
        INNER JOIN campaign_settings c ON r.campaign_id = c.campaign_id
        WHERE c.is_deleted = false AND c.shop_id = $1`,
        [session?.shop]
      );
      // console.log(referrals.rows);
      return res.status(200).json(referrals.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
}
