export const replace_welcome_email_text = async (
  email_text,
  campaign,
  shop,
  email
) => {
  let user_referral_code = await pool.query(
    'SELECT * FROM referrals WHERE email=$1',
    [email]
  );
  let reward_link = `https://xychros-backend-test-store.myshopify.com/pages/test?code=${user_referral_code.rows[0].referral_code}`;
  email_text = email_text.replace(
    '{campaign.name}',
    `${campaign.rows[0].name}`
  );
  email_text = email_text.replace(
    '{campaign.product}',
    `${campaign.rows[0].product}`
  );
  email_text = email_text.replace('{reward_link}', `${reward_link}`);
  email_text = email_text.replace('{shop}', `${shop}`);
  return email_text;
};

export const replace_referral_email_text = async (
  email_text,
  campaign,
  shop,
  referral_code,
  friends_count
) => {
  let reward_link = `https://xychros-backend-test-store.myshopify.com/pages/test?code=${referral_code}`;
  email_text = email_text.replace(
    '{campaign.name}',
    `${campaign.rows[0].name}`
  );
  email_text = email_text.replace(
    '{campaign.product}',
    `${campaign.rows[0].product}`
  );
  email_text = email_text.replace('{reward_link}', `${reward_link}`);
  email_text = email_text.replace('{shop}', `${shop}`);
  email_text = email_text.replace('{friends_count}', `${friends_count}`);
  return email_text;
};

export const replace_reward_email_text = async (
  email_text,
  campaign,
  shop,
  referral_code,
  friends_count,
  discount_code
) => {
  let reward_link = `https://xychros-backend-test-store.myshopify.com/pages/test?code=${referral_code}`;
  email_text = email_text.replace(
    '{campaign.name}',
    `${campaign.rows[0].name}`
  );
  email_text = email_text.replace(
    '{campaign.product}',
    `${campaign.rows[0].product}`
  );
  email_text = email_text.replace('{reward_link}', `${reward_link}`);
  email_text = email_text.replace('{shop}', `${shop}`);
  email_text = email_text.replace('{friends_count}', `${friends_count}`);
  email_text = email_text.replace('{discount_code}', `${discount_code}`);
  return email_text;
};
