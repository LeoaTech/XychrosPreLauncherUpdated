import { Shopify } from "@shopify/shopify-api";

//import { db } from '../prelauncherDB.js';
import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/prelaunchdb",
});

// pool.connect((err, result) => {
//   if (err) throw err;
//   console.log("Connected");
// });

export default function templatesApiEndpoints(app) {
  //read all campaign

  app.get("/api/templates", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const templates = await pool.query(`SELECT t.id, trp.*, tlp.*
      FROM templates t
      INNER JOIN template_rewards_page trp ON t.rewards_template_id = trp.id
      INNER JOIN template_landing_page tlp ON t.landing_template_id = tlp.id`);
      res.json(templates.rows);
    } catch (err) {
      console.error(err);
    }
  });
}
