function pLen(obj, l=1) {
  if (l == 1) {
    return Object.getOwnPropertyNames(obj).length;
  };
  return Object.getOwnPropertyNames(obj);
};

function deepEqual(obj1, obj2) {
  var res = true;
  let l1 = obj1.length, l2 = obj2.length,
      lp1 = pLen(obj1), lp2 = pLen(obj2);
  if ( obj1.valueOf() === obj2.valueOf() && typeof( obj1.valueOf() ) != "object" ) {
    res = true;
  } else if (l1 && l2 && l1 == l2) {
    for (let i = 0; i < l1; i++) {
      res = deepEqual(obj1[i], obj2[i]);
      if (!res) { return false };
    };
  } else if ( lp1 && lp2 && lp1 == lp2 ) {
    let p1 = pLen(obj1, 0), p2 = pLen(obj2, 0);
    for (let i = 0; i < lp1; i++) {
      res = deepEqual(obj1[p1[i]], obj2[p1[i]]);
      if (!res) { return false };
    };
  } else { 
    return false;
  };
  return res;
};

module.exports = deepEqual;
