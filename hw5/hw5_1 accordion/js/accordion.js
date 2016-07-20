'use strict';

function toggleItem(el){
  if (el.parentNode.classList.contains("active")) {
    hide_all();
    el.parentNode.classList.remove("active");
  } else {
    hide_all();
    el.parentNode.classList.add("active");
  }
}

function init(){
  hide_all();
  var acc = document.getElementById("accordion");
  function clkFn(e) {
    if (e.target.nodeName == 'H2') {
      toggleItem(e.target);
    }
  }
  acc.addEventListener('click', clkFn);
}
function hide_all(){
  let divs = document.getElementsByClassName("active");
  for (var i=0; i<divs.length; i++){
    divs[i].classList.remove("active");
  }
}
