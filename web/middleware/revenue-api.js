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
                `WITH CampaignRevenue AS (
                    SELECT
                        cs.campaign_id,
                        SUM(CASE WHEN DATE_TRUNC('day', CAST(od.created_at AS DATE)) = DATE_TRUNC('day', CAST(cs.start_date AS DATE))
                        OR DATE_TRUNC('day', CAST(od.created_at AS DATE)) = DATE_TRUNC('day', CAST(cs.end_date AS DATE))
                        OR DATE_TRUNC('day', CAST(od.created_at AS DATE)) BETWEEN DATE_TRUNC('day', CAST(cs.start_date AS DATE)) AND DATE_TRUNC('day', CAST(cs.end_date AS DATE))
                        THEN od.total_price ELSE 0 END) AS campaign_revenue
                    FROM
                        campaign_settings cs
                    JOIN
                        order_details od
                    ON
                        cs.shop_id = od.shop_id
                        WHERE od.shop_id = $1
                    GROUP BY
                        cs.campaign_id
                )
                SELECT
                    campaign_id,
                    campaign_revenue,
                    SUM(campaign_revenue) OVER () AS total_revenue
                FROM
                    CampaignRevenue
                ORDER BY
                    campaign_id;
                `,
                [session?.shop]
            );
            console.log(revenue.rows);
            return res.status(200).json(revenue.rows);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to Fetch Revenue", error: error.message });
        }
    });
}