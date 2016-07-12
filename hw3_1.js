'use strict';

function forEach(array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i]);
  };
};

function filter(array, fn) {
  let res = [];
  for (let i = 0; i < array.length; i++) {
    if ( fn(array[i]) ) {
      res[res.length] = array[i];
    };
  };
  return res;
};

function map(array, fn) {
  let res = [];
  for (let i = 0; i < array.length; i++) {
    res[i] = fn(array[i]);
  };
  return res;
};

function reduce(array, fn, initVal) {
  let res = array[0], first = 1;
  if (initVal && array.length > 0) {
    res = initVal;
    first = 0
  }
  for (let i = first; i < array.length; i++) {
    res = fn(res, array[i]);
  };
  return res;
};

function slice(array, start, end) {
  let res = [];
  start = (start > 0) ? start: array.length + start;
  end = (end > 0) ? end: array.length + end;
  if (!end) {
    end = array.length;
  }
  for (let i = start; i < end; i++) {
    res[res.length] = array[i];
  };
  return res;
};

function splice(array, start, num) {
  let del = [], res = [];
  start = (start > 0) ? start: array.length + start;
  if (start + num > array.length) {
    num = array.length - start;
  }
  // first part
  for (let i = 0; i < start; i++) {
    res[res.length] = array[i];
  };
  // del
  for (let i = start; i < start+num; i++) {
    del[del.length] = array[i];
  };
  // inset
  for (let i = 3; i < arguments.length; i++) {
    res[res.length] = arguments[i];
  };
  // last part
  for (let i = start + num; i < array.length; i++) {
    res[res.length] = array[i];
  };
  array.length = 0;
  for (let i = 0; i < res.length; i++) {
    array[array.length] = res[i];
  };
  return del;
};

module.exports = {forEach, filter, map, reduce, slice, splice};
