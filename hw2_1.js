'use strict';

function isAllTrue(source, filterFn) {
  try{
    if (source.length > 0) {
      let res = true;
      for (var i = 0; i < source.length; i++) {
        res = res && filterFn(source[i]);
      };
      return res;
    }
    else {
      throw new Error("Массив не должен быть пустым!");
    }
  }
  catch(e){console.log(e.message);}
};

module.exports = isAllTrue;
