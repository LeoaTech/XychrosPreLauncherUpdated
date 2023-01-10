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
