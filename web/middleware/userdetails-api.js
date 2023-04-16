import { Shopify } from "@shopify/shopify-api";

import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: "postgres://postgres:postgres@localhost:5432/prelaunchdb",
});

pool.connect((err, result) => {
  if (err) throw err;
  console.log("Connected");
});

export default function userDetailsApiEndPoint(app) {
  //read Global setting for the shop id

  app.get("/api/userprofile", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });

  // Insert new userdetails
  app.post("/api/userprofile", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const {} = req.body;

      const userDetails = await pool.query(``);
    } catch (err) {
      console.error(err.message);
    }
  });

  //update userdetails at shop_id
  app.put("/api/userprofile", async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );

      const {} = req.body;

      const userDetails = await pool.query(
        `
        `,
        [session?.shop]
      );
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
}
