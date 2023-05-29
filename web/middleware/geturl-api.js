import { Shopify } from '@shopify/shopify-api';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

export default function getUrlApi(app) {
  app.post('/api/geturl', async (req, res) => {
    try {
      console.log('I am here in fetch API URL');
      console.log(req.query);
      console.log(req.body);
      const shop = req.query.shop;
      const campaign = req.body.campaign_name;

      console.log(shop);
      console.log(campaign);

      const imageURL = await pool.query(
        `select t.image_url from templates t inner join campaign_settings c on t.id = c.template_id where c.name = '${campaign}' and c.shop_id = '${shop}'`
      );

      const campaign_details = await pool.query(
        `SELECT * from campaign_settings where name='${campaign}' and shop_id = '${shop}'`
      );

      res.status(200).json({
        success: true,
        imageURL: imageURL.rows[0].image_url,
        campaign_data: campaign_details.rows[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
    }
  });
}
