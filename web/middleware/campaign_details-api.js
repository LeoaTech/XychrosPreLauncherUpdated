import { Shopify } from '@shopify/shopify-api';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
});

pool.connect((err, result) => {
    if (err) throw err;
});

export default function campaignDetailsApiEndpoints(app) {
    //read all campaigns Details

    app.get('/api/campaigndetails', async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(
                req,
                res,
                app.get('use-online-tokens')
            );



            const campaigns = await pool.query(
                `SELECT cs.*,
                cd.is_active, cd.is_draft, cd.landing_page_link, cd.rewards_page_link
                FROM campaign_settings cs
                JOIN campaign_details cd ON cs.campaign_id = cd.campaign_id
                WHERE cs.shop_id = $1 `,
                [session?.shop]
            );
            return res.status(200).json(campaigns?.rows);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    });
    //get one campaign

    //create campaign
    app.post('/api/campaigndetails', async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(
                req,
                res,
                app.get('use-online-tokens')
            );

            const {
                campaign_name,
                discount_code_1,
                discount_code_2,
                discount_code_3,
                discount_code_4,
                landing_template_link,
                landing_page_link,
                rewards_template_link,
                rewards_page_link,
                is_draft,
                is_active
            } = req.body;

            let campaignID;
            const campaignExists = await pool.query(`select * from campaign_settings where name = $1`, [campaign_name])

            if (campaignExists?.rowCount > 0) {
                campaignID = campaignExists?.rows[0]?.campaign_id
                const query = `
                INSERT INTO campaign_details(
                    campaign_id,
                    is_draft,
                    is_active,
                    landing_template_link,
                    rewards_template_link,
                    landing_page_link,
                    rewards_page_link,
                    discount_code_1,
                    discount_code_2,
                    discount_code_3,
                    discount_code_4,
                    shop_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;


                const campaigns = await pool.query(query, [
                    campaignID,
                    is_draft,
                    is_active,
                    landing_template_link,
                    rewards_template_link,
                    landing_page_link,
                    rewards_page_link,
                    discount_code_1,
                    discount_code_2,
                    discount_code_3,
                    discount_code_4,
                    session?.shop,
                ]);

                return res.status(201).json(campaigns.rows);
            } else {
                return res.json({ message: "Campaign not exists" })
            }
        } catch (err) {
            return res.status(500).json({ error: 'Internal Server Error' });

        }

    })

}