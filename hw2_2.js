'use strict';

function isSomeTrue(source, filterFn) {
  try{
    if (source.length > 0) {
      let res = false;
      for (var i = 0; i < source.length; i++) {
        res = res || filterFn(source[i]);
      };
      return res;
    }
    else {
      throw new Error("Массив не должен быть пустым!");
    }
  }
  catch(e){console.log(e.message);}
};

module.exports = isSomeTrue
