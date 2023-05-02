import { sendemail } from './sendEmails.js';

import NewPool from 'pg';
const { Pool } = NewPool;
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/prelauncher',
});

export const replace_welcome_email_text = async (
  referer,
  campaign,
  shop,
  email
) => {
  let email_text = campaign.rows[0].welcome_email;

  let user_referral_code = await pool.query(
    'SELECT * FROM referrals WHERE email=$1 and campaign_id=$2',
    [email, campaign.rows[0].campaign_id]
  );
  let reward_link = `${referer}?refer=${user_referral_code.rows[0].referral_code}`;
  if (email_text.includes('{campaign_name}')) {
    email_text = email_text.replace(
      '{campaign_name}',
      `${campaign.rows[0].name}`
    );
  }

  if (email_text.includes('{referral_link}')) {
    email_text = email_text.replace('{referral_link}', `${reward_link}`);
  }
  if (email_text.includes('{shop_name}')) {
    email_text = email_text.replace('{shop_name}', `${shop}`);
  }
  return email_text;
};

export const replace_referral_email_text = async (
  referer,
  campaign,
  shop,
  referral_code,
  friends_count
) => {
  let reward_link = `${referer}?refer=${referral_code}`;
  let email_text = campaign.rows[0].referral_email;

  console.log(email_text);

  if (email_text.includes('{campaign_name}')) {
    email_text = email_text.replace(
      '{campaign_name}',
      `${campaign.rows[0].name}`
    );
  }

  if (email_text.includes('{referral_link}')) {
    email_text = email_text.replace('{referral_link}', `${reward_link}`);
  }
  if (email_text.includes('{shop_name}')) {
    email_text = email_text.replace('{shop_name}', `${shop}`);
  }
  if (email_text.includes('{referral_count}')) {
    email_text = email_text.replace('{referral_count}', `${friends_count}`);
  }

  return email_text;
};

export const replace_reward_email_text = async (
  referer,
  campaign,
  shop,
  referral_code,
  friends_count,
  discount_code
) => {
  let reward_link = `${referer}?refer=${referral_code}`;
  let email_text = campaign.rows[0].reward_email;

  if (email_text.includes('{campaign_name}')) {
    email_text = email_text.replace(
      '{campaign_name}',
      `${campaign.rows[0].name}`
    );
  }

  if (email_text.includes('{referral_link}')) {
    email_text = email_text.replace('{referral_link}', `${reward_link}`);
  }
  if (email_text.includes('{shop_name}')) {
    email_text = email_text.replace('{shop_name}', `${shop}`);
  }
  if (email_text.includes('{referral_count}')) {
    email_text = email_text.replace('{referral_count}', `${friends_count}`);
  }
  if (email_text.includes('{discount_code}')) {
    email_text = email_text.replace('{discount_code}', `${discount_code}`);
  }
  console.log(email_text);
  return email_text;
};

export const send_email = async (message, email, subject) => {
  try {
    console.log(message);
    await sendemail({
      to: email,
      subject: subject,
      text: message,
    });
  } catch (error) {
    console.log(error);
  }
};
