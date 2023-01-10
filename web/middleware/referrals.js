import { Shopify } from '@shopify/shopify-api';

import queryString from 'query-string';
import crypto from 'crypto';
//import { db } from '../prelauncherDB.js';
import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

export default function referralsApiEndpoints(app, secret) {
  //get user

  app.post('/api/getuser', async (req, res) => {
    console.log('In the data API block');
    try {
      // const session = await Shopify.Utils.loadCurrentSession(
      //   req,
      //   res,
      //   app.get('use-online-tokens')
      // );

      const query_signature = req.query.signature;
      console.log(req.ip);
      console.log(req.headers.referer);
      console.log(req.query);

      const userEmail = req.query.email;

      const referrerID = 'd5ItPXbX';
      const campaignID = 1;

      console.log(userEmail);
      console.log(referrerID);
      console.log(campaignID);

      const users = await pool.query(
        `SELECT findreferrals('${userEmail}', '${referrerID}', ${campaignID})`
      );

      // console.log(users);
      console.log(users.rows);

      res.status(200).send({ message: 'Got it' });

      //   const queryObj = Object.assign({}, req.query);
      //   const { signature: _signature, hmac, ...map } = queryObj;

      //   const orderedMap = Object.keys(map)
      //     .sort((value1, value2) => value1.localeCompare(value2))
      //     .reduce((accum, key) => {
      //       accum[key] = map[key];
      //       return accum;
      //     }, {});

      //   const message = queryString.stringify(orderedMap);
      //   const generatedHash = crypto
      //     .createHmac('sha256', SHOPIFY_CLIENT_SECRET)
      //     .update(message)
      //     .digest('hex');

      //   // Safe Compare
      //   const aLen = Buffer.byteLength(generatedHash);
      //   const bLen = Buffer.byteLength(hmac);

      //   if (aLen !== bLen) {
      //     return res.status(400).send('HMAC validation failed');
      //   }

      //   // Turn strings into buffers with equal length
      //   // to avoid leaking the length
      //   const buffA = Buffer.alloc(aLen, 0, 'utf8');
      //   buffA.write(stringA);
      //   const buffB = Buffer.alloc(bLen, 0, 'utf8');
      //   buffB.write(stringB);

      //   const valid = crypto.timingSafeEqual(buffA, buffB);
      //   if (!valid) {
      //     return res.status(400).send('HMAC validation failed');
      //   }

      //   const formData = await Shopify.Utils.par;
      //   console.log(session);
      //   console.log(valid);
      //   const users = await pool.query('select * from users where email = $1', [
      //     session.id,
      //   ]);
      //   res.json(users.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

  //create user

  //get all users

  //delete campaign
}
