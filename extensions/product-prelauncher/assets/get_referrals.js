let count_referrals = document.getElementById("count_referrals");
let referral_div = document.getElementById("referral_rows");
let urlParams = new URL(window.location.href).searchParams;
let user_code = urlParams.get("referralCode");
function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
const get_referrals = async () => {
  const url = "/apps/xychros_backend_new/api/get_referrals/";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ referral_code: user_code }),
  });
  const data = await response.json();
  if (response.status == 200) {
    if (data.message.length > 0) {
      count_referrals.innerText = `Total Referrals Joined: ${data.message.length}`;
      console.log(data);
    } else {
      count_referrals.innerText =
        "0 friends have joined! Invite friends to Join";
    }
  }
};

get_referrals();

