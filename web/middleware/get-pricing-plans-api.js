import { Shopify } from "@shopify/shopify-api";
import NewPool from "pg";
const { Pool } = NewPool;
const pool = new Pool({
    connectionString: "postgres://postgres:postgres@localhost:5432/prelauncher",
});

pool.connect((err, result) => {
    if (err) throw err;
});

export default function pricingPlansApiEndpoints(app) {
    //read all Pricng plans
    app.get('/api/pricing-plans', async (req, res) => {
        try {
            const price_plans = await pool.query(
                `SELECT * FROM  pricing_plans`,
            );

            return res.status(200).json(price_plans.rows);

        } catch (error) {
            return res.status(500).json(error)
        }
    })


}
