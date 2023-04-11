import axios from "axios";
import { Shopify } from "@shopify/shopify-api";

import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/prelaunchdb",
});

// Axios to make API Call for Klaviyo-list-keys
export default function integrationApi(app) {
  app.get("/api/lists", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const result = await pool.query(
        `select klaviyo_api_key from global_settings where shop_id = $1`,
        [session?.shop]
      );
      const apiKey = result?.rows[0]?.klaviyo_api_key;

      if (!apiKey || apiKey === "") {
        res.status(400).send({
          message: "Please Enable Klaviyo API Integration from Global Settings",
        });
        return;
      }

      const list = await axios.get(
        `https://a.klaviyo.com/api/v2/lists?api_key=${apiKey}`
      );

      res.status(200).send(list?.data);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  });
}
