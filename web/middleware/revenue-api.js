import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';
import NewPool from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const { Pool } = NewPool;
const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
});

pool.connect((err, result) => {
    if (err) throw err;
    console.log("Revenue API Connected");
});

export default function revenueApiEndpoint(app) {
    app.get("/api/generate_revenue", async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(
                req,
                res,
                app.get("use-online-tokens")
            );

            const revenue = await pool.query(
                `SELECT SUM(total_price) as total_revenue
                FROM order_details
                WHERE shop_id = $1`,
                [session?.shop]
            );
            console.log(revenue.rows);
            return res.status(200).json(revenue.rows);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to Fetch Total Revenue", error: error.message });
        }
    });
}