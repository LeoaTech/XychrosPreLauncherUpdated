let form = document.getElementById("form-submission");
let email = document.getElementById("email");
let button = document.getElementById("submit-btn");

let email_value = undefined;
email.addEventListener("change", (e) => {
  e.preventDefault();
  email_value = email.value;
});
button.addEventListener("click", async (e) => {
  let code = null;
  if (window.location.href.includes("?")) {
    const params = window.location.href.split("?");
    code = params[1];
  }
  let url = "/apps/xychros_backend_new/api/check_email/";
  let data_ = {};
  if (code) {
    data_ = { email: email_value, code: code, campaign_id: 1 };
  } else {
    data_ = { email: email_value, campaign_id: 1 };
  }
  if (email_value) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_),
    });
    const data = await response.json();
    if (response.status == 200) {
      document.cookie = `email=${email_value}`;
      window.location.href =
        "https://xychros-backend-test-store.myshopify.com/pages/second-page";
    } else if (response.status == 404) {
      showSnackbar("snackbar2");
    } else {
      showSnackbar("snackbar");
    }
  }
});

function showSnackbar(id) {
  var snackBar = document.getElementById(id);

  snackBar.className = "show-bar";
  setTimeout(function () {
    snackBar.className = snackBar.className.replace("show-bar", "");
  }, 5000);
}
