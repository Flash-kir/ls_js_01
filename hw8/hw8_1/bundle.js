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
	    search = document.getElementById("tSearch"),
	    sBlk = document.getElementById("sBlk"),
	    sList = document.getElementById("sList"),
	    url_town = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json",
	    towns;

	window.my_timer = fn.timer;

	function tfilter() {
	  let list = [];

	  for (let i = 0; i < towns.length; i++) {
	    if (towns[i].toLowerCase().indexOf(search.value.toLowerCase()) >= 0) {
	      list.push({ name: towns[i] });
	    }
	  }
	  if (list.length == 0) {
	    list.push({ name: "Совпадений не найдено" });
	  }

	  let source = document.getElementById('townList').innerHTML;
	  let templateFn = Handlebars.compile(source);

	  sBlk.innerHTML = templateFn({ towns: list });
	}

	document.addEventListener("DOMContentLoaded", () => {
	  fn.ajaxGet(url_town).then(function (resp) {
	    towns = fn.sortList(resp);
	    tfilter();
	  });
	});

	search.addEventListener('keyup', tfilter);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function timer(delay) {
	  return new Promise(function (resolve, reject) {
	    setTimeout(() => {
	      return resolve();
	    }, delay);
	  });
	}

	function ajaxGet(url) {
	  return new Promise(function (resolve, reject) {
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