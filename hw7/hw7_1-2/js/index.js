'use strict';

let btn = document.getElementById("btn");
let sh = document.getElementById("sheet");
let activeElement = null, cX = 0, cY = 0;

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getBlk() {
  let blk = document.createElement('div');
  let blkBtn = document.createElement('div');
  let w = 0, h = 0, t = 0, l = 0;
  l = getRandom(sh.offsetLeft, sh.clientWidth-sh.offsetLeft);
  t = getRandom(sh.offsetTop, sh.clientHeight-sh.offsetTop);
  w = getRandom(20, sh.clientWidth-l);
  h = getRandom(20, sh.clientHeight-t);
  blk.className = "blk";
  blkBtn.className = "blk__btn-rm";
  blkBtn.innerText = "x";
  blk.style = "background-color: rgb("+getRandom(0,255)+","+getRandom(0,255)+","+getRandom(0,255)+"); "+
    "position: absolute; "+
    "left: "+l+"px; "+
    "top: "+t+"px; "+
    "width: "+w+"px; "+
    "height: "+h+"px; ";
  blk.appendChild(blkBtn);
  console.log(blk.clientWidth);
  return blk
}

function add(e) {
  sh.appendChild(getBlk())
}

function del(el) {
  el.parentNode.remove();
}

function blk(e) {
  if (e.target.className == 'blk__btn-rm') {
    del(e.target);
  }
}

function mDown(e) {
  activeElement = e.target;
  cX = e.offsetX;
  cY = e.offsetY;
}

function mUp(e) {
  activeElement = null;
}

function mMove(e) {
  if (activeElement) {
    activeElement.style.left = (e.clientX - cX) + 'px';
    activeElement.style.top = (e.clientY - cY) + 'px';
  }
}

btn.addEventListener('click', add);
sh.addEventListener('click', blk);
sh.addEventListener('mousedown', mDown);
sh.addEventListener('mouseup', mUp);
sh.addEventListener('mousemove', mMove);