'use strict';

let fn = require("./hw6.js"),
  search = document.getElementById("tSearch"),
  sBlk = document.getElementById("sBlk"),
  sList = document.getElementById("sList"),
  url_town = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json",
  towns;

window.my_timer = fn.timer;

function tfilter() {
  let list = [];
  
  for (let i = 0; i < towns.length; i++) {
    if (towns[i].toLowerCase().indexOf(search.value.toLowerCase()) >= 0){
      list.push({name:towns[i]});
    }
  }
  if (list.length == 0) {
    list.push({name:"Совпадений не найдено"});
  }
  
  let source = document.getElementById('townList').innerHTML;
  let templateFn = Handlebars.compile(source);

  sBlk.innerHTML = templateFn({towns: list});
}

document.addEventListener("DOMContentLoaded", ()=>{
  fn.ajaxGet(url_town).then(
    function (resp) {
      towns = fn.sortList(resp);
      tfilter();
    }
  )
});

search.addEventListener('keyup', tfilter);