//Get Referral count and referral link

let count_referrals = document.getElementById('count_referrals');
let referral_div = document.getElementById('referral_rows');
let urlParams2 = new URL(window.location.href).searchParams;
let user_code2 = urlParams.get('referralCode');
var copyCode = document.getElementById('code');
var campaignid = 5;

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
      campaign_id: campaignid,
    }),
  });
  const data = await response.json();
  if (response.status == 200) {
    if (data.message.length > 0) {
      count_referrals.innerText = `Total Referrals Joined: ${data.message.length}`;
      console.log(data);
    } else {
      count_referrals.innerText =
        '0 friends have joined! Invite friends to Join';
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
