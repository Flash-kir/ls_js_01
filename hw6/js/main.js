'use strict';

let fn = require("./hw6.js"),
  btn = document.getElementById("getTwn"),
  url_town = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json";

window.my_timer = fn.timer;

btn.addEventListener('click',
  function getTowns() {
    fn.ajaxGet(url_town).then(
    function (resp) {
      let towns = fn.sortList(resp);
      if (document.getElementById("town_list")) {
        document.getElementById("town_list").remove()
      }
      let ul_el = document.createElement("UL");
      if (towns.length) {
        ul_el.id = "town_list";
        document.body.appendChild(ul_el);
      }
      for (let i = 0; i < towns.length; i++) {
        let li_el = document.createElement("LI");
        li_el.textContent = towns[i];
        ul_el.appendChild(li_el);
      }
    })
  }
);