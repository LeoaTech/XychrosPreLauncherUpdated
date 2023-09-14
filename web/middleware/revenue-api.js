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
                `WITH TotalRevenue AS (
                    SELECT
                        SUM(total_price) AS total_revenue
                    FROM
                        order_details
                    WHERE
                        shop_id = $1
                ),
                CampaignRevenue AS (
                    SELECT
                        cs.campaign_id,
                        SUM(CASE
                            WHEN (DATE_TRUNC('day', CAST(od.created_at AS DATE)) 
                            BETWEEN DATE_TRUNC('day', CAST(cs.start_date AS DATE)) 
                            AND DATE_TRUNC('day', CAST(cs.end_date AS DATE)))
                            AND customer_tags LIKE '%' || cs.name || '%'
                            THEN od.total_price
                            ELSE 0
                        END) AS campaign_revenue
                    FROM
                        campaign_settings cs
                    JOIN
                        order_details od ON cs.shop_id = od.shop_id
                    WHERE
                        od.shop_id = $1
                    GROUP BY
                        cs.campaign_id
                )
                SELECT
                    cr.campaign_id,
                    cr.campaign_revenue,
                    tr.total_revenue
                FROM
                    CampaignRevenue cr
                JOIN
                    TotalRevenue tr ON 1=1
                ORDER BY
                    cr.campaign_id;
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