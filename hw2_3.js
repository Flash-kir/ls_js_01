'use strict';

function calculator(n) {
  function sum() {
    res = n;
    for (let i = 0; i < arguments.length; i++) {
      res += arguments[i];
    };
    return res;
  };

  function dif() {
    res = n;
    for (let i = 0; i < arguments.length; i++) {
      res -= arguments[i];
    };
    return res;
  };

   function div() {
     res = n;
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
    res = n;
    for (let i = 0; i < arguments.length; i++) {
      res *= arguments[i];
    };
    return res;
  };

  return {
    sum: sum, 
    dif: dif,
    div: div,
    mul: mul
  }  
};

module.exports = calculator;
