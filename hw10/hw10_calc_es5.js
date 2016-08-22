'use strict';

function Calculator(firstNumber) {
  this.firstNumber = firstNumber;
}

Calculator.prototype.sum = function () {
    var res = this.firstNumber;
    for (let i = 0; i < arguments.length; i++) {
      res += arguments[i];
    }
    return res;
  };

Calculator.prototype.dif = function () {
    var res = this.firstNumber;
    for (let i = 0; i < arguments.length; i++) {
      res -= arguments[i];
    }
    return res;
  };

Calculator.prototype.div = function () {
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

Calculator.prototype.mul = function () {
    var res = this.firstNumber;
    for (let i = 0; i < arguments.length; i++) {
      res *= arguments[i];
    }
    return res;
  };


function SqrCalc(firstNumber) {
  Calculator.call(this, firstNumber);
}

SqrCalc.prototype.sqr = function sqr(a) {
  return a * a;
};

SqrCalc.prototype.sum = function (arg) {
  return this.sqr( Calculator.prototype.sum.call(this, arg ) );
};
SqrCalc.prototype.div = function (arg) {
  return this.sqr( Calculator.prototype.div.call(this, arg ) );
};
SqrCalc.prototype.dif = function (arg) {
  return this.sqr( Calculator.prototype.dif.call(this, arg ) );
};
SqrCalc.prototype.mul = function (arg) {
  return this.sqr( Calculator.prototype.mul.call(this, arg ) );
};


// let myCalculator = new SqrCalc(100);
//
// console.log(myCalculator.sum(1, 2, 3)); //вернет 106
// console.log(myCalculator.dif(10, 20)); //вернет 70
// console.log(myCalculator.div(2, 2)); //вернет 25
// console.log(myCalculator.mul(2, 2)); //вернет 400console.log();

module.exports = SqrCalc;