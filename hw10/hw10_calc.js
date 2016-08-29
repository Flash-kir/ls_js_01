'use strict';

class Calculator {
    constructor (firstNumber) {
    this.firstNumber = firstNumber;
};
  sum() {
    var res = this.firstNumber;
    for (let i = 0; i < arguments.length; i++) {
      res += arguments[i];
    }
    return res;
  };

  dif() {
    var res = this.firstNumber;
    for (let i = 0; i < arguments.length; i++) {
      res -= arguments[i];
    }
    return res;
  }

   div() {
     var res = this.firstNumber;
     for (let i = 0; i < arguments.length; i++) {
       if (arguments[i] != 0){
         res /= arguments[i];
       }
       else {
         throw new Error("На ноль делить нельзя!!");
       }
     }
     return res;
  };

  mul() {
    var res = this.firstNumber;
    for (let i = 0; i < arguments.length; i++) {
      res *= arguments[i];
    }
    return res;
  };
}

class SqrCalc extends Calculator {
  constructor(firstNumber) {
    super(firstNumber);
  };
  sqr (a) {
    return a * a;
  };
  sum () {
    return this.sqr( super.sum(...arguments) );
  };
  div () {
  	return this.sqr( super.div(...arguments) );
  };
  dif () {
  	return this.sqr( super.dif(...arguments) );
  };
  mul () {
  	return this.sqr( super.mul(...arguments) );
  }
}

// let myCalculator = new SqrCalc(100);
//
// console.log(myCalculator.sum(1, 2, 3)); //вернет 106
// console.log(myCalculator.dif(10, 20)); //вернет 70
// console.log(myCalculator.div(2, 2)); //вернет 25
// console.log(myCalculator.mul(2, 2)); //вернет 400console.log();

module.exports = SqrCalc;