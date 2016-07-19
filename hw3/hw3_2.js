'use strict';

function pLen(obj, l=1) {
  if (l == 1) {
    return Object.getOwnPropertyNames(obj).length;
  }
  return Object.getOwnPropertyNames(obj);
}

function getV(obj) {
  if (obj instanceof Function) {
    return obj.toString();
  } else if (obj instanceof Date) {
    return obj.valueOf();
  } else if (obj instanceof Object) {
    return obj;
  }
  return obj.valueOf();
}

function deepEqual(obj1, obj2) {
  var res = true;
  let l1 = obj1.length, l2 = obj2.length,
      lp1 = pLen(obj1), lp2 = pLen(obj2);
  if ( getV(obj1) === getV(obj2) && typeof(getV(obj1)) != "object" ) {
    res = true;
  } else if (l1 && l2 && l1 == l2 && typeof(getV(obj1)) == "object") {
    for (let i = 0; i < l1; i++) {
      res = deepEqual( getV(obj1[i]), getV(obj2[i]) );
      if (!res) { return false }
    }
  } else if ( lp1 && lp2 && lp1 == lp2 && typeof(getV(obj1)) == "object") {
    let p1 = pLen(obj1, 0), p2 = pLen(obj2, 0);
    for (let i = 0; i < lp1; i++) {
      res = deepEqual( getV(obj1[p1[i]]), getV(obj2[p1[i]]) );
      if (!res) { return false }
    }
  } else {
    return false;
  }
  return res;
}

module.exports = deepEqual;
