'use strict';

let btn = document.getElementById("btn");
let btn_sv = document.getElementById("btn-sv");
let sh = document.getElementById("sheet");
let activeElement = null, cX = 0, cY = 0;

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getBlk(stl="") {
  let blk = document.createElement('div');
  let blkBtn = document.createElement('div');
  blk.className = "blk";
  blkBtn.className = "blk__btn-rm";
  blkBtn.innerText = "x";
  if (!stl) {
    let w = 0, h = 0, t = 0, l = 0;
    l = getRandom(sh.offsetLeft, sh.clientWidth-sh.offsetLeft);
    t = getRandom(sh.offsetTop, sh.clientHeight-sh.offsetTop);
    w = getRandom(20, sh.clientWidth-l);
    h = getRandom(20, sh.clientHeight-t);
    blk.style = "background-color: rgb("+getRandom(0,255)+","+getRandom(0,255)+","+getRandom(0,255)+"); "+
      "position: absolute; "+
      "left: "+l+"px; "+
      "top: "+t+"px; "+
      "width: "+w+"px; "+
      "height: "+h+"px; ";
  } else {
    blk.style = stl;
  }
  blk.appendChild(blkBtn);
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

function clrCookies(nameHas) {
  let cookie = document.cookie.split('; ');
  if (document.cookie) {
    for (let i = 0; i < cookie.length; i++) {
      if (cookie[i].split('=')[0].indexOf(nameHas) == 0) {
          var date = new Date(0);
          document.cookie = cookie[i].split('=')[0]+"=; expires=" + date.toUTCString();
      }
    }
  }
}

function save() {
  clrCookies("blocks");
  var date = new Date;
  date.setDate(date.getDate() + 1);
  let blks = document.getElementsByClassName("blk"),
      res = "";
  for (let i = 0; i < blks.length; i++) {
    res = "background-color: "+blks[i].style.backgroundColor+"_ position: absolute_ "+
    "left: "+blks[i].style.left+"_ "+
    "top: "+blks[i].style.top+"_ "+
    "width: "+blks[i].style.width+"_ "+
    "height: "+blks[i].style.height+"_ ";
    document.cookie = "blocks_"+i+"=" + res + "; expires=" + date.toUTCString();
  }
}

function load() {
  let cookie = document.cookie.split('; ');
  if (document.cookie) {
    for (let i = 0; i < cookie.length; i++) {
      if (cookie[i].split('=')[0].indexOf("blocks") == 0 && cookie[i].split('=')[1]) {
          sh.appendChild( getBlk(cookie[i].split('=')[1].split("_").join(";")) );
      }
    }
  }
}

btn.addEventListener('click', add);
btn_sv.addEventListener('click', save);
sh.addEventListener('click', blk);
sh.addEventListener('mousedown', mDown);
sh.addEventListener('mouseup', mUp);
sh.addEventListener('mousemove', mMove);
document.addEventListener("DOMContentLoaded", load);