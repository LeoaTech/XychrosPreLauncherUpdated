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

      // const { file } = req.query;
      // const imageUrl = `/assets/shopify_assets/${file}`;
      // const imagePath = imageUrl?.substring(imageUrl?.indexOf('/web'));
      //res.status(200).send({ url: imagePath, message: 'i came to the URL' });
      res.status(200).json({
        success: true,
        imageURL: imageURL.rows[0].image_url,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error });
    }
  });
}
