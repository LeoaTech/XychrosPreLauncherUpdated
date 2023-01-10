var form = document.getElementById('form-submission'),
  actionPath = '',
  formData = null;

var xhr = new XMLHttpRequest();

form.addEventListener(
  'submit',
  (e) => {
    console.log('I came here');
    e.preventDefault();

    formData = new FormData(form);
    actionPath = form.getAttribute('action');

    console.log(formData);
    console.log(actionPath);

    xhr.open('GET', actionPath);
    xhr.send(formData);
  },
  false
);

// $('#form-submission').on('submit', function (event) {
//   var $form = $(this);

//   $.ajax({
//     url: $form.attr('action').replace('', '/api/getuser'),
//     data: $form.serialize(),
//     success: function (evt) {
//       // Show a success message.
//       console.log(evt);
//     },
//     error: function (err) {
//       // Show an error message.
//       console.log(err);
//     },
//     // complete: function () {
//     //   $form.append('<p>AJAX response received.</p>');
//     // },
//   });

//   event.preventDefault();
// });
