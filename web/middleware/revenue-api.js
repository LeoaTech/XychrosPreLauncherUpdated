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
                    SELECT currency, SUM(total_price) AS total_revenue
                    FROM order_details
                    WHERE shop_id = $1
                    Group by currency
                ),
                CustomerLastSubscription AS (
                    SELECT r.email, MAX(r.created_at::DATE) AS last_subscription_date
                    FROM referrals r
                    GROUP BY r.email
                ),
                CampaignRevenue AS (
                    SELECT
                        cs.campaign_id,
                        SUM(CASE
                            WHEN (
                                od.customer_tags LIKE '%' || cs.name || '%' AND
                                (
                                    lr.last_subscription_date IS NULL OR
                                    (
                                        CAST(cs.start_date AS DATE) <= CAST(od.created_at::DATE AS DATE) AND
                                        (lr.last_subscription_date > CAST(od.created_at::DATE AS DATE) OR lr.last_subscription_date <= CAST(cs.end_date AS DATE))
                                    )
                                )
                            )
                            THEN od.total_price
                            ELSE 0
                        END) AS campaign_revenue
                    FROM campaign_settings cs
                    JOIN order_details od ON cs.shop_id = od.shop_id
                    LEFT JOIN CustomerLastSubscription lr ON lr.email = od.customer_email
                    WHERE od.shop_id = $1
                    GROUP BY cs.campaign_id
                )
                SELECT cr.campaign_id, cr.campaign_revenue, tr.total_revenue, tr.currency
                FROM CampaignRevenue cr
                JOIN TotalRevenue tr ON 1=1
                ORDER BY cr.campaign_id;
                `,
                [session?.shop]
            );
            // console.log(revenue.rows);
            return res.status(200).json(revenue.rows);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to Fetch Revenue", error: error.message });
        }
    });

    // last six months revenue
    app.get("/api/fetch_revenue", async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(
                req,
                res,
                app.get("use-online-tokens")
            );

            const six_months_revenue = await pool.query(
                `SELECT SUM(total_price) AS total_months_revenue, 
                to_char(CAST(created_at::DATE AS DATE), 'YYYY-MM') AS created_month 
                FROM order_details 
                WHERE CAST(created_at::DATE AS DATE) >= CURRENT_DATE - INTERVAL '5 months'
                AND CAST(created_at::DATE AS DATE) <= CURRENT_DATE
                AND shop_id = $1 
                GROUP BY created_month 
                ORDER BY created_month DESC
                `,
                [session?.shop]
            );
            // console.log(six_months_revenue.rows);
            return res.status(200).json(six_months_revenue.rows);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Failed to Fetch Last Six Months Revenue", error: error.message });
        }
    });
}