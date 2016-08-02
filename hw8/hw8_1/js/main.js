'use strict';

let fn = require("./hw6.js"),
  search = document.getElementById("tSearch"),
  sBlk = document.getElementById("sBlk"),
  sList = document.getElementById("sList"),
  url_town = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json";

window.my_timer = fn.timer;

search.addEventListener('keydown', 
    function () {
      fn.ajaxGet(url_town).then(
      function (resp) {
        let towns = fn.sortList(resp), list = [];
        
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
      })
  }
);