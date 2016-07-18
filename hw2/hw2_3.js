'use strict';

function calculator(n) {
  function sum() {
    var res = n;
    for (let i = 0; i < arguments.length; i++) {
      res += arguments[i];
    };
    return res;
  };

  function dif() {
    var res = n;
    for (let i = 0; i < arguments.length; i++) {
      res -= arguments[i];
    };
    return res;
  };

   function div() {
     var res = n;
     for (let i = 0; i < arguments.length; i++) {
       if (arguments[i] != 0){
         res /= arguments[i];
       }
       else {
         throw new Error("На ноль делить нельзя!!");
       }
     };
     return res;
  };

  function mul() {
    var res = n;
    for (let i = 0; i < arguments.length; i++) {
      res *= arguments[i];
    };
    return res;
  };

  return {
    sum, 
    dif,
    div,
    mul
  }  
};

module.exports = calculator;
