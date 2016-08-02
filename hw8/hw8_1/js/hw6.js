'use strict';

function timer(delay) {
  return new Promise(
    function (resolve, reject) {
      setTimeout(() => {return resolve()}, delay);
    }
  );
}

function ajaxGet(url) {
  return new Promise( function (resolve, reject) {
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

function sortList(list, str="") {
  let res = [];
  for (let i = 0; i < list.length; i++) {
    res.push(list[i].name);
  }
  return res.sort();
}

module.exports = {timer, ajaxGet, sortList};