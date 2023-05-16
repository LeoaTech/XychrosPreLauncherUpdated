// var form = document.getElementById('form-submission'),
//   actionPath = '',
//   formData = null;

// var xhr = new XMLHttpRequest();

// form.addEventListener(
//   'submit',
//   (e) => {
//     console.log('I came here');
//     e.preventDefault();

//     formData = new FormData(form);
//     actionPath = form.getAttribute('action');

//     console.log(formData);
//     console.log(actionPath);

//     xhr.open('GET', actionPath);
//     xhr.send(formData);
//   },
//   false
// );

console.log("hello world");
console.log(first_page_settings);

const update_clicks = async () => {
  const response = await fetch(
    "/apps/xychros_backend_new/api/updatecampaigns/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaign_name: first_page_settings.campaign_name,
      }),
    }
  );
  const data = await response.json();
  console.log(data);
};
update_clicks();
