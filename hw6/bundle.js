/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let fn = __webpack_require__(1),
	    btn = document.getElementById("getTwn"),
	    search = document.getElementById("tSearch"),
	    sBlk = document.getElementById("sBlk"),
	    url_town = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json";

	window.my_timer = fn.timer;

	btn.addEventListener('click', function () {
	  fn.ajaxGet(url_town).then(function (resp) {
	    let towns = fn.sortList(resp);
	    let ul_el = document.getElementById("town_list");
	    ul_el.innerHTML = "";
	    for (let i = 0; i < towns.length; i++) {
	      let li_el = document.createElement("LI");
	      li_el.textContent = towns[i];
	      ul_el.appendChild(li_el);
	    }
	  });
	});

	search.addEventListener('keydown', function () {
	  fn.ajaxGet(url_town).then(function (resp) {
	    let towns = fn.sortList(resp);
	    let ul_el = document.getElementById("sList");
	    ul_el.innerHTML = "";
	    for (let i = 0; i < towns.length; i++) {
	      if (towns[i].toLowerCase().indexOf(search.value.toLowerCase()) >= 0) {
	        let li_el = document.createElement("LI");
	        li_el.textContent = towns[i];
	        ul_el.appendChild(li_el);
	      }
	    }
	    if (!ul_el.childElementCount) {
	      let li_el = document.createElement("LI");
	      if (search.value) {
	        li_el.textContent = "Совпадений не найдено";
	        ul_el.appendChild(li_el);
	      } else {
	        li_el.textContent = "Совпадений не найдено";
	        ul_el.innerHTML = "";
	      }
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	let towns;

	function timer(delay) {
	  return new Promise(function (resolve, reject) {
	    setTimeout(() => {
	      return resolve();
	    }, delay);
	  });
	}

	function ajaxGet(url) {
	  return new Promise(function (resolve, reject) {
	    if (towns) return resolve(towns);
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET', url, true);

	    xhr.responseType = 'json';

	    xhr.onload = function () {
	      if (this.status == 200) {
	        resolve(this.response);
	      } else {
	        let err = new Error(this.status);
	        err.code = this.status;
	        reject(err);
	      }
	    };

	    xhr.onerror = function () {
	      reject("Наверное что-то случилось..");
	    };

	    xhr.send();
	  });
	}

	function sortList(list, str = "") {
	  let res = [];
	  for (let i = 0; i < list.length; i++) {
	    res.push(list[i].name);
	  }
	  return res.sort();
	}

	module.exports = { timer, ajaxGet, sortList };

/***/ }
/******/ ]);