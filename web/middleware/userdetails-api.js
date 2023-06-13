import { Shopify } from '@shopify/shopify-api';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: `${process.env.DATABASE_URL}`,
});

// pool.connect((err, result) => {
//   if (err) throw err;
//   console.log("Connected");
// });

export default function userDetailsApiEndPoint(app) {
  //read Global setting for the shop id

  app.get('/api/userprofile', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );

      const user = await pool.query(
        `SELECT * FROM  user_details where store_url= $1`,
        [session?.shop]
      );

      return res.status(200).json(user.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });

  // Insert new userdetails
  app.post('/api/userprofile', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );

      const { firstname, lastname, email, billing_id } = req.body;

      const fullName = `${firstname} ${lastname}`;
      const user = await pool.query(
        `INSERT INTO user_details (
          username,email,store_url,billing_id) VALUES($1,$2,$3,$4) RETURNING *`,
        [fullName, email, session?.shop, billing_id]
      );

      return res.status(201).json(user.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });

  //update userdetails at shop_id
  app.put('/api/userprofile', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get('use-online-tokens')
      );

      const { email, firstname, lastname, billing_id } = req.body;
      const fullName = `${firstname} ${lastname}`;
      const updateUser = await pool.query(
        `UPDATE user_details SET 
          username =$1,
          email =$2,
          billing_id=$3
          WHERE 
          store_url =$4 
          RETURNING *`,
        [fullName, email, billing_id, session?.shop]
      );

      res.status(200).json(updateUser?.rows);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  });
}
