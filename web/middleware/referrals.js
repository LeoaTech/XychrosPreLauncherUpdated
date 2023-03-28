import { Shopify } from '@shopify/shopify-api';

import queryString from 'query-string';
import crypto from 'crypto';
//import { db } from '../prelauncherDB.js';
import emailValidator from 'deep-email-validator';
import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

export default function referralsApiEndpoints(app, secret) {
  // endpoint to get users for Shopify Customers
  app.post('/api/getuser', async (req, res) => {
    console.log('In the data API block');
    try {
      // const session = await Shopify.Utils.loadCurrentSession(
      //   req,
      //   res,
      //   app.get('use-online-tokens')
      // );

      const query_signature = req.query.signature;
      let ip_address =
        req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
      ip_address = ip_address.split(',')[0];

      console.log(ip_address);
      console.log(req.headers.referer);
      console.log(req.query);

      const userEmail = req.query.email;
      const referrerID = req.query.refer;

      const campaign = await pool.query(
        `SELECT campaign_id from campaign_settings where name='${req.query.campaign}' and shop_id='${req.query.shop}'`
      );
      const campaignID = campaign.rows[0].campaign_id;

      console.log(userEmail);
      console.log(referrerID);
      console.log(campaignID);

      // check if email is valid
      let isemail_valid = await emailValidator.validate(userEmail);

      if (isemail_valid.validators.smtp.valid == false) {
        return res
          .status(404)
          .json({ success: false, message: 'Please provide a valid email' });
      }

      // get referral code and number of referrals

      const users = await pool.query(
        `SELECT referral_code FROM referrals where email='${userEmail}' and campaign_id=${campaignID}`
      );

      let referralcode = '';

      if (users.rows[0]) {
        referralcode = users.rows[0].referral_code;
      } else {
        // get referral code for new sign-ups

        // check IP Addresses
        const getIPAddress = await pool.query(
          `SELECT count_ip FROM ip_addresses WHERE address='${ip_address}'`
        );

        let count = 1;

        // previous entry of IP address
        if (getIPAddress.rows.length > 0) {
          count = getIPAddress.rows[0].count_ip;

          // if IP exists more than 2 times
          if (count >= 2) {
            count = count + 1;
            let data = await pool.query(
              `UPDATE ip_addresses SET count_ip=${count}, updated_at=now() WHERE address='${ip_address}'`
            );

            return res.status(400).json({
              success: false,
              message: 'You have already requested 2 times',
            });
          } else {
            // if IP exists less than 2 times
            count = count + 1;
            let data = await pool.query(
              `UPDATE ip_addresses SET count_ip=${count}, updated_at=now() WHERE address='${ip_address}'`
            );

            const getreferrals = await pool.query(
              `INSERT INTO referrals (email, referrer_id, campaign_id) VALUES ('${userEmail}', '${referrerID}', ${campaignID}) RETURNING (referral_code)`
            );

            referralcode = getreferrals.rows[0].referral_code;
          }
        } else {
          // IP address does not exist
          let data = await pool.query(
            `INSERT INTO ip_addresses (address,count_ip,campaign_id,updated_at) VALUES('${ip_address}',${count},${campaignID}, now())`
          );

          const getreferrals = await pool.query(
            `INSERT INTO referrals (email, referrer_id, campaign_id) VALUES ('${userEmail}', '${referrerID}', ${campaignID}) RETURNING (referral_code)`
          );

          referralcode = getreferrals.rows[0].referral_code;
        }
      }

      console.log(referralcode);

      return res.status(307).json({ referral: referralcode });

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

  // get referrals for Merchant dashboard
  // get users

  //get all users
}
