'use strict';

let fn = require("./hw6.js"),
  btn = document.getElementById("getTwn"),
  search = document.getElementById("tSearch"),
  sBlk = document.getElementById("sBlk"),
  url_town = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json";

window.my_timer = fn.timer;

btn.addEventListener('click',
  function () {
    fn.ajaxGet(url_town).then(
    function (resp) {
      let towns = fn.sortList(resp);
      let ul_el = document.getElementById("town_list");
      ul_el.innerHTML = "";
      for (let i = 0; i < towns.length; i++) {
        let li_el = document.createElement("LI");
        li_el.textContent = towns[i];
        ul_el.appendChild(li_el);
      }
    })
  }
);

search.addEventListener('keydown', 
    function () {
      fn.ajaxGet(url_town).then(
      function (resp) {
        let towns = fn.sortList(resp);
        let ul_el = document.getElementById("sList");
        ul_el.innerHTML = "";
        for (let i = 0; i < towns.length; i++) {
          if (towns[i].toLowerCase().indexOf(search.value.toLowerCase()) > 0){
            let li_el = document.createElement("LI");
            li_el.textContent = towns[i];
            ul_el.appendChild(li_el);
          }
        }
        if (!ul_el.childElementCount) {
            let li_el = document.createElement("LI");
            li_el.textContent = "Совпадений не найдено";
            ul_el.appendChild(li_el);
        }
      })
  }
);