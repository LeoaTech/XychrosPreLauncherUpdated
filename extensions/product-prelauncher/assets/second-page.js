const totalProducts = product_list.count;

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
  var copyCode = document.getElementById("code");
  copyCode.select();
  copyCode.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyCode.value);
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 2000);
}

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
    instagram.href = "https://instagram.com/";
    
    const snapchat = document.querySelector('.snapchat');
    snapchat.href = "https://accounts.snapchat.com/accounts/login";
    
    const tiktok = document.querySelector('.tiktok');
    tiktok.href = "https://www.tiktok.com/en/";
  }, 500)
}
