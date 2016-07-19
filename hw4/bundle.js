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

	let fn = __webpack_require__(1);

	window.my_prepend = fn.prepender;
	window.my_deleteTextNodes = fn.deleteTextNodes;
	window.my_scanDOM = fn.scanDOM;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	function prepender(container, newElement) {
	  container.insertBefore(newElement, container.firstChild);
	}

	function deleteTextNodes(el) {
	  let cn = el.childNodes;
	  for (let i = cn.length; i > 0; i--) {
	    if (cn[i - 1].nodeType == 3) {
	      el.removeChild(cn[i - 1]);
	    } else if (cn[i - 1].childNodes.length > 0) {
	      deleteTextNodes(cn[i - 1]);
	    }
	  }
	}

	let dict = {};

	function add(dict, elem) {
	  if (dict[elem]) {
	    dict[elem] += 1;
	  } else {
	    dict[elem] = 1;
	  }
	}

	function log(dict) {
	  let tagKeys = Object.keys(dict.tag);
	  for (let i = tagKeys.length; i > 0; i--) {
	    console.log("Тэгов " + tagKeys[i - 1] + ": " + dict.tag[tagKeys[i - 1]]);
	  }
	  console.log("Текстовых узлов: " + dict.text.text);
	  let classKeys = Object.keys(dict.class);
	  for (let i = classKeys.length; i > 0; i--) {
	    console.log("Элементов с классом " + classKeys[i - 1] + ": " + dict.class[classKeys[i - 1]]);
	  }
	  dict = {};
	}

	function scanElem(el, dict) {
	  if (el.nodeType == 3) {
	    add(dict.text, 'text');
	  } else if (el.nodeType == 1) {
	    add(dict.tag, el.nodeName.toLowerCase());
	    if (el.classList.length) {
	      for (let i = el.classList.length; i > 0; i--) {
	        add(dict.class, el.classList[i - 1]);
	      }
	    }
	  }

	  if (el.childNodes.length) {
	    for (let i = el.childNodes.length; i > 0; i--) {
	      scanElem(el.childNodes[i - 1], dict);
	    }
	  }
	}

	function scanDOM(el) {
	  dict = { tag: {}, text: { text: 0 }, class: {} };

	  scanElem(el, dict);

	  log(dict);
	}

	module.exports = { prepender, deleteTextNodes, scanDOM };

/***/ }
/******/ ]);