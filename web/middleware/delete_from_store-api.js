import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';
import NewPool from "pg";

const { Pool } = NewPool;
const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
});

pool.connect((err, result) => {
    if (err) throw err;
    console.log("DeleteFromStore API Connected");
});

const api_version = '2022-10';

const deleteFromStore = async (accessToken, shopURL, idsData) => {

    // extract ids
    const themeid = idsData.theme_id;

    const template_keys = {
        landing_template: idsData.landing_template_key,
        rewards_template: idsData.rewards_template_key
    }

    const page_ids = {
        landing_page: idsData.landing_page_id,
        rewards_page: idsData.rewards_page_id
    }

    // set headers
    const headers = {
        'X-Shopify-Access-Token': accessToken
    };

    // delete templates
    const deleteTemplates = async () => {
        for (const key in template_keys) {

            const url = `https://${shopURL}/admin/api/${api_version}/themes/${themeid}/assets.json?asset[key]=${template_keys[key]}`;

            try {
                const response = await fetch(url, {
                    method: 'DELETE',
                    headers,
                });
                const data = await response.json();
                if (!response.ok) {
                    console.log(`Failed to Delete Template [${template_keys[key]}]`);
                } else {
                    console.log(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // delete pages
    const deletePages = async () => {
        for (const id in page_ids) {
            try {
                const response = await fetch(
                    `https://${shopURL}/admin/api/${api_version}/pages/${page_ids[id]}.json`, {
                    method: 'DELETE',
                    headers,
                });

                if (!response.ok) {
                    console.log(`Failed to Delete Page [${page_ids[id]}]`);
                } else {
                    console.log(`{ message: Page having Id [${page_ids[id]}] was successfully deleted }`);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    await deleteTemplates();
    await deletePages();
}

// --------------------------------------- API ------------------------------------

export default function deleteFromStoreApiEndpoint(app) {
    app.post("/api/delete_from_store", async (req, res) => {
        try {
            const session = await Shopify.Utils.loadCurrentSession(
                req,
                res,
                app.get("use-online-tokens")
            );
            const { accessToken, shop } = session;
            const { campaign_id } = req.body;
            // console.log(accessToken, shop);
            // console.log(campaign_id);

            const campaignExists = await pool.query(
                `SELECT
                theme_id, 
                landing_template_key,
                landing_page_id,
                rewards_template_key,
                rewards_page_id,
                tier1_segment_id,
                tier2_segment_id,
                tier3_segment_id,
                tier4_segment_id,
                tier1_price_rule_id,
                tier2_price_rule_id,
                tier3_price_rule_id,
                tier4_price_rule_id
                FROM campaign_details
                WHERE campaign_id = $1
                AND shop_id = $2 `,
                [campaign_id, session?.shop]
            );
            
            let data;
            if (campaignExists?.rowCount > 0) {
                data = campaignExists?.rows[0];
            }
            await deleteFromStore(accessToken, shop, data);
            return res.status(200).json({ success: true, message: "Templates, Pages, Segments and Price Rules Deleted Successfully" });

        } catch (error) {
            return res.status(400).json({ success: false, message: "Failed to Delete Templates, Pages, Segments and Price Rules from Store", error: error.message });
        }
    });
}