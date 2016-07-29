'use strict';

let name = document.getElementById("name"),
  value= document.getElementById("value"),
  expire = document.getElementById("expire");



function addTr(name, value) {
  let tbody = document.getElementsByClassName("tbody")[0];
  tbody.innerHTML += "<tr><td>"+ name +"</td>" +
      "<td>"+ value +"</td>" +
      "<td><div class='btn-rm'>x</div></td></tr>";
}

function createTable() {
  let cookie = document.cookie.split('; ');
  let table = document.createElement("table");
  table.className = "table";
  table.innerHTML = "<thead class='thead'><th>cookie name</th><th>cookie value</th><th>cookie btns</th></thead>" +
      "<tbody class='tbody'></tbody>";
  document.body.appendChild(table);
  if (document.cookie) {
    for (let i = 0; i < cookie.length; i++) {
      addTr(cookie[i].split('=')[0], cookie[i].split('=')[1]);
    }
  }
}

function del(el) {
  let isDel = confirm("Удалить cookie с именем "+ el.firstChild.innerText +"?");
  if (isDel) {
    var date = new Date(0);
    document.cookie = el.firstChild.innerText+"=; expires=" + date.toUTCString();
    el.remove();
  }
}

function click(e) {
  if (e.target.className == 'btn-rm') {
    del(e.target.parentNode.parentNode);
  } else if (e.target.className == 'btn-add') {
    if (name.value && value.value && expire.value) {
      let exp = expire.value;
      var date = new Date;
      if (exp*2) {
        date.setDate(date.getDate() + exp*1);
        document.cookie = name.value + "=" + value.value + "; expires=" + date.toUTCString();
        addTr(name.value, value.value);
        expire.value = "";
        name.value = "";
        value.value = "";
      } else {
        alert("incoorect expires!");
        expire.value = "";
      }
    } else {
      alert("Заполните все поля формы");
    }
  }
}

document.addEventListener("DOMContentLoaded", createTable);
document.addEventListener('click', click);
