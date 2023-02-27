import { Shopify } from "@shopify/shopify-api";

//import { db } from '../prelauncherDB.js';
import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/prelauncher",
});

// pool.connect((err, result) => {
//   if (err) throw err;
//   console.log("Connected");
// });

export default function campaignApiEndpoints(app) {
  //read all campaign

  app.get("/api/getcampaigns", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );


      const campaigns = await pool.query(
        "select * from campaigns where shop_id = $1 ",
        [session?.id]
      );
      res.json(campaigns.rows);
    } catch (err) {
      console.error(err);
    }
  });
  //get one campaign

  //create campaign
  //update campaign
  //delete campaign
}
