import axios from 'axios';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

export const add_to_klaviyo_list = async (
  email,
  phone,
  campaign_details,
  shop
) => {
  try {
    const campaign = campaign_details.rows[0];

    let klaviyo_key = await pool.query(
      `SELECT * from global_settings where shop_id='${shop}'`
    );
    const apiKey = klaviyo_key?.rows[0]?.klaviyo_api_key;

    if (!apiKey || apiKey === '') {
      return 'Please Enable Klaviyo API Integration from Global Settings';
    }

    let options = '';

    if (campaign.klaviyo_integration) {
      if (campaign.collect_phone) {
        options = {
          method: 'POST',
          url: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
          headers: {
            accept: 'application/json',
            revision: '2023-02-22',
            'content-type': 'application/json',
            Authorization: `Klaviyo-API-Key ${apiKey}`,
          },
          data: {
            data: {
              type: 'profile-subscription-bulk-create-job',
              attributes: {
                list_id: `${campaign.klaviyo_list_id}`,
                subscriptions: [
                  {
                    channels: { email: ['MARKETING'], sms: ['MARKETING'] },
                    email: `${email}`,
                    phone_number: `${phone}`,
                  },
                ],
              },
            },
          },
        };
      } else {
        options = {
          method: 'POST',
          url: 'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
          headers: {
            accept: 'application/json',
            revision: '2023-02-22',
            'content-type': 'application/json',
            Authorization: `Klaviyo-API-Key ${apiKey}`,
          },
          data: {
            data: {
              type: 'profile-subscription-bulk-create-job',
              attributes: {
                list_id: `${campaign.klaviyo_list_id}`,
                subscriptions: [
                  {
                    channels: { email: ['MARKETING'] },
                    email: `${email}`,
                  },
                ],
              },
            },
          },
        };
      }

      // console.log('In the klaviyo integration block');
      // console.log(options);
      // console.log(apiKey);

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          return response.data;
        })
        .catch(function (error) {
          console.error(error);
        });

      return 'Subscribed to Klaviyo';
    } else {
      return 'Klaviyo Integration is disabled';
    }
  } catch (error) {
    console.log(error);
  }
};
