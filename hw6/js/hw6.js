'use strict';

function timer(delay) {
  return new Promise(
    function (resolve, reject) {
      setTimeout(() => {return resolve()}, delay);
    }
  );
}

module.exports = {timer};