export const dummyTeplates = [
  { id: 1, name: "Clothing" },
  { id: 2, name: "Jewellery" },
  { id: 3, name: "Clothing" },
  { id: 4, name: "Pop Culture" },
  { id: 5, name: "Audio" },
  { id: 6, name: "Electronics" },
  { id: 7, name: "Male" },
  { id: 8, name: "Female" },
  { id: 9, name: "Travelling" },
  { id: 10, name: "Health & Fitness" },
  { id: 11, name: "Home & Living" },
  { id: 12, name: "Outdoor" },
  { id: 13, name: "Mobiles" },
  { id: 14, name: "Motor Bikes" },
  { id: 15, name: "Fashion" },
];



// Default Email Settings
export const InitialDefaultEmail = `
Hi,

Thank you for subscribing to {campaign.name} for the pre-launch of {product.name}. You can now invite your friends and family to join you in collecting more rewards and points by using {reward.link}.

So far, {reward.friends_count} friends have joined using your reward link. You can redeem your points by using the discount code {reward.discount_code} at checkout. 

We are excited to have you on board!

{shop.name}`;

export const InitialReferralEmail = `

Hi,

Congratulations!! A new referral has signed up at {campaign.name} for the pre-launch of {product.name}. You can now invite more friends and family to join you in collecting more rewards and points by using {referral.link}.

So far, {referral.friends_count} friends have joined using your referral link. 

We are excited to have you on board!

{shop.name}`;

export const InitialRewardEmail = `Hi there,

Congratulations!! You have unlocked the Reward Tier {{ reward_tier_number}} at {campaign.name} for the pre-launch of {product.name}. You can invite more friends and family to join you in collecting more rewards and points by using {referral.link}.

So far, {referral.friends_count} friends have joined using your referral link. You can redeem your points by using the discount code {referral.discount_code} at checkout. 

We are super excited to see you winning!!

{shop.name}`;