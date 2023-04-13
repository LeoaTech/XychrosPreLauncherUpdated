//Get Referral count and referral link

let count_referrals = document.getElementById('count_referrals');
let referral_div = document.getElementById('referral_rows');
let current_referrals = document.getElementById('current_referrals');
let remaining_referrals = document.getElementById('remaining_referrals');

let urlParams2 = new URL(window.location.href).searchParams;
let user_code2 = urlParams2.get('referralCode');
var copyCode = document.getElementById('code');
// get campaign name
const campaign_name = document.getElementById('review_campaign_name');

// find referral details for rewards page
const get_referrals = async () => {
  const url = '/apps/xychrosupdated/api/get_referrals';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      referral_code: user_code2,
      campaign_name: campaign_name.innerHTML,
    }),
  });
  const data = await response.json();
  if (response.status == 200) {
    let campaign_data = data.campaign_data.rows[0];

    console.log(data);
    if (data.referral_data.length > 0) {
      count_referrals.innerText = `Total Referrals Joined: ${data.referral_data.length}`;
      current_referrals.innerText = `${data.referral_data.length}`;

      // remaining_referrals.innerText = `${.length}`;
    } else {
      count_referrals.innerText =
        '0 friends have joined! Invite friends to Join';
      current_referrals.innerText = 0;
      remaining_referrals.innerText = `${data.message.length}`;
    }
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

function copyToClipboard() {
  copyCode.select();
  copyCode.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyCode.value);
  var x = document.getElementById('snackbarCopy');
  x.className = 'show';
  setTimeout(function () {
    x.className = x.className.replace('show', '');
  }, 2000);
}

// Sharing copied messages

let link = encodeURI(window.location.href);
let subject = 'Subject';
let message = 'Hello there!';

subject = encodeURIComponent(subject);
encodedMessage = encodeURIComponent(message);

const email = document.querySelector('.email');
email.href = `mailto:?&subject=${'subject of email'}&body=${encodedMessage}`;

const twitter = document.querySelector('.twitter');
twitter.href = `https://twitter.com/share?url=${encodedMessage}`;

const whatsapp = document.querySelector('.whatsapp');
whatsapp.href = `https://wa.me/?text=${encodedMessage}`;

function copyMessage() {
  let text = 'hi there this is to be copied...';
  navigator.clipboard.writeText(text);
  setTimeout(() => {
    const fb = document.querySelector('.facebook');
    fb.href = 'https://www.facebook.com/';

    const instagram = document.querySelector('.instagram');
    instagram.href = 'https://instagram.com/';

    const snapchat = document.querySelector('.snapchat');
    snapchat.href = 'https://accounts.snapchat.com/accounts/login';

    const tiktok = document.querySelector('.tiktok');
    tiktok.href = 'https://www.tiktok.com/en/';
  }, 500);
}
