// Get Campaign Name
const campaign_name = document.getElementById('review_campaign_name');

// Get Referral Count and Referral Link Input Field
let count_referrals = document.getElementById('count_referrals');
let referral_div = document.getElementById('referral_rows');
let current_referrals = document.getElementById('current_referrals');
let remaining_referrals = document.getElementById('remaining_referrals');

let urlParams2 = new URL(window.location.href).searchParams;
let user_code2 = urlParams2.get('referralCode');
let referral_inp_field = document.getElementById('code');

// Get Referral Link Copy Button
let copy_btn = document.getElementById("copy_referral_code_btn");

// Generate Referral Link
let urlData = window.location.href;
urlData = urlData.split('/pages')[0];
urlData = urlData + `/pages/${second_page_settings.page}?refer=${user_code2}`;
console.log(urlData);

// Get Socials Icons
let share_email_referral = document.getElementById('rewards_email_refferal');
let share_facebook_referral = document.getElementById('rewards_facebook_refferal');
let share_twitter_referral = document.getElementById('rewards_twitter_refferal');
let share_snapchat_referral = document.getElementById('rewards_snapchat_refferal');
let share_instagram_referral = document.getElementById('rewards_instagram_refferal');
let share_tiktok_referral = document.getElementById('rewards_tiktok_refferal');
let share_whatsapp_referral = document.getElementById('rewards_whatsapp_refferal');
let share_discord_referral = document.getElementById('rewards_discord_refferal');

// Find and Set Referral Details For Rewards Page
const get_referrals = async () => {
  console.log('I came here');
  console.log(campaign_name.innerHTML);
  const url = '/apps/xychrosupdated/api/get_referrals';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      referral_code: user_code2,
      campaign_name: `'${campaign_name.innerHTML}'`,
    }),
  });
  const data = await response.json();
  console.log(data);

  if (response.status == 200) {

    // get campaign data
    let campaign_data = data.campaign_data.rows[0];
    console.log(campaign_data);

    // set inp field value equal to referral link
    referral_inp_field.value = urlData;
    referral_inp_field.innerHTML = urlData;
    const my_referral_link = referral_inp_field.value;

    // copy referral link to clipboard
    if (referral_inp_field.value) {
      copy_btn.addEventListener('click', function (e) {
        e.preventDefault();
        referral_inp_field.select();
        referral_inp_field.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(referral_inp_field.value);
        var x = document.getElementById('snackbarCopy');
        x.className = 'show';
        setTimeout(function () {
          x.className = x.className.replace('show', '');
        }, 2000);
      });
    }

    // share referral link on social media as per campaign settings

    // Share Referral Link via Email
    if (campaign_data.share_email_referral === false) {
      share_email_referral.style.display = "none";
    } else {
      if (share_email_referral) {
        share_email_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const email_subject = 'Email Subject';
          const email_body = campaign_data.share_email_message + "\n" + my_referral_link;
          const mailtoUrl = 'mailto:' + '?subject=' + encodeURIComponent(email_subject) + '&body=' + encodeURIComponent(email_body);
          window.location.href = mailtoUrl;
        });
      }
    }

    // Share Referral Link via Facebook
    if (campaign_data.share_facebook_referral === false) {
      share_facebook_referral.style.display = "none";
    } else {
      const shareOnFacebook = function (postText) {
        const facebookUrl = 'https://www.facebook.com/sharer/sharer.php';
        const fburl = `${facebookUrl}?u=${encodeURIComponent(my_referral_link)}&quote=${encodeURIComponent(postText)}`;
        window.open(fburl, '_blank', 'width=600,height=400');
      };
      if (share_facebook_referral) {
        share_facebook_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const facebook_message = campaign_data.share_facebook_message;
          shareOnFacebook(facebook_message);
        });
      }
    }

    // Share Referral Link via Twitter
    if (campaign_data.share_twitter_referral === false) {
      share_twitter_referral.style.display = "none";
    } else {
      function shareOnTwitter(tweetText) {
        const twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText) + '&url=' + encodeURIComponent(my_referral_link);
        window.open(twitterUrl, '_blank', 'width=600,height=400');
      }
      if (share_twitter_referral) {
        share_twitter_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const twitter_message = campaign_data.share_twitter_message;
          shareOnTwitter(twitter_message);
        });
      }
    }

    // Share Referral Link via Snapchat
    if (campaign_data.share_snapchat_referral === false) {
      share_snapchat_referral.style.display = "none";
    } else {
      function shareOnSnapchat() {
        const snapchatUrl = 'https://www.snapchat.com/';
        window.open(snapchatUrl, '_blank', 'width=600,height=400');
      }
      if (share_snapchat_referral) {
        share_snapchat_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const snapchat_message = campaign_data.share_snapchat_message + "\n" + my_referral_link;
          navigator.clipboard.writeText(snapchat_message);
          shareOnSnapchat();
        });
      }
    }

    // Share Referral Link via Instagram
    if (campaign_data.share_instagram_referral === false) {
      share_instagram_referral.style.display = "none";
    } else {
      function shareOnInstagram() {
        const instagramUrl = 'https://www.instagram.com/';
        window.open(instagramUrl, '_blank', 'width=600,height=400');
      }
      if (share_instagram_referral) {
        share_instagram_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const instagram_message = campaign_data.share_instagram_message + "\n" + my_referral_link;
          navigator.clipboard.writeText(instagram_message);
          shareOnInstagram();
        });
      }
    }

    // Share Referral Link via Tiktok
    if (campaign_data.share_tiktok_referral === false) {
      share_tiktok_referral.style.display = "none";
    } else {
      function shareOnTiktok() {
        const tiktokUrl = 'https://www.tiktok.com/';
        window.open(tiktokUrl, '_blank', 'width=600,height=400');
      }
      if (share_tiktok_referral) {
        share_tiktok_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const tiktok_message = campaign_data.share_tiktok_message + "\n" + my_referral_link;
          navigator.clipboard.writeText(tiktok_message);
          shareOnTiktok();
        });
      }
    }

    // Share Referral Link via Whatsapp
    if (campaign_data.share_whatsapp_referral === false) {
      share_whatsapp_referral.style.display = "none";
    } else {
      if (share_whatsapp_referral) {
        share_whatsapp_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const whatsapp_message = campaign_data.share_whatsapp_message + "\n" + my_referral_link;
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsapp_message)}`;
          window.open(whatsappUrl, '_blank', 'width=600,height=400');
        });
      }
    }

    // Share Referral Link via Discord
    if (campaign_data.share_discord_referral === false) {
      share_discord_referral.style.display = "none";
    } else {
      function shareOnDiscord() {
        const discordUrl = 'https://discord.com/channels/@me';
        window.open(discordUrl, '_blank', 'width=600,height=400');
      }
      if (share_discord_referral) {
        share_discord_referral.addEventListener('click', function (e) {
          e.preventDefault();
          const discord_message = campaign_data.share_discord_message + "\n" + my_referral_link;
          navigator.clipboard.writeText(discord_message);
          shareOnDiscord();
        });
      }
    }

    // end of social media settings

    // set number of referrals joined 
    if (data.referral_data.length > 0) {
      count_referrals.innerText = `Total Referrals Joined: ${data.referral_data.length}`;
      current_referrals.innerText = `${data.referral_data.length}`;

      // remaining_referrals.innerText = `${.length}`;
    } else {
      count_referrals.innerText =
        '0 friends have joined! Invite friends to Join';
      current_referrals.innerText = 0;
      remaining_referrals.innerText = `${data.referral_data.length}`;
    }

  } else {
    console.log(data);
  }
};

get_referrals();

//Hover effect on rewards
// const totalProducts = product_list.count;

function mouseenter(x) {
  let childrenelements = x.children;
  for (let i = 0; i < childrenelements.length; i++) {
    childrenelements[i].style.display = 'block';
  }
}

function mouseleave(x) {
  let childrenelements = x.children;
  for (let i = 0; i < childrenelements.length; i++) {
    childrenelements[i].style.display = 'none';
  }
}

function mouseenterproduct(x) {
  let childrenelements = x.children;
  for (let i = 1; i < childrenelements.length; i++) {
    childrenelements[i].style.display = 'block';
  }
}

function mouseleaveproduct(x) {
  let childrenelements = x.children;
  for (let i = 1; i < childrenelements.length; i++) {
    childrenelements[i].style.display = 'none';
  }
}
