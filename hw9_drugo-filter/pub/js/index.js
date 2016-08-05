(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let userList = [], store = localStorage;

new Promise(function(resolve) {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.init({
      apiId: 5572480
    });

    VK.Auth.login(function(response) {
      if (response.session) {
        document.getElementById('friendItemTemplate').setAttribute("data-uid", response.session.mid);
        let data = JSON.parse(store.data || '{}');
        if (data[document.getElementById('friendItemTemplate').getAttribute("data-uid")]) {
          userList = data[document.getElementById('friendItemTemplate').getAttribute("data-uid")];
        }

        resolve(response);
      } else {
        reject(new Error('Не удалось авторизоваться'));
      }
    }, 8);
  });
}).then(function() {
  function sortByName(items) {
    items.sort( 
      (a, b)=>{
        if (a.first_name + " " + a.last_name < b.first_name + " " + b.last_name) {
          return -1
        } else {
          return 1
        }
        return 0
      });
    
    return items
  }
  
  return new Promise(function(resolve, reject) {
    VK.api('friends.get', {name_case:"nom", v:"5.53", fields: "photo_50"}, function(response) {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {

        let source = document.getElementById('friendItemTemplate').innerHTML;
        let templateFn = Handlebars.compile(source);
        let template = templateFn({list: sortByName(response.response.items) });
        document.getElementsByClassName("friends-panel")[0].innerHTML = template;
        
        resolve();
      }
    });
  })
}).then(function() {
  let fsearch = document.querySelector(".friends.search input"),
      ssearch = document.querySelector(".save.search input"),
      flist = document.querySelector(".friends.list .friends-panel"),
      slist = document.querySelector(".save.list .friends-panel"),
      plists = document.querySelector(".panel_lists"),
      btn = document.querySelector(".btn");
  
  let compare = function (a, b) {
    let name = a.children[1].innerText;
    if (name.toLowerCase().indexOf(b) >= 0) {
      return true
    } else {
      return false
    }
  };
  
  let search_friends = function (cls) {
    let friends = document.querySelector("."+cls + ".list .friends-panel").children,
        sval;
    if (cls == 'friends') {
      sval = fsearch.value
    } else {
      sval = ssearch.value
    }
    // console.log(sval, cls, friends, typeof sval);
    if (typeof sval == 'string') {
      for (let i=0; i < friends.length; i++) {
        if ( compare(friends[i], sval.toLowerCase()) ){
          if (friends[i].classList.contains("hide")) {
            friends[i].classList.remove("hide");
          }
        } else {
          if (!friends[i].classList.contains("hide")) {
            friends[i].classList.add("hide");
          }
        }
      }
    }
  };
  
  function dragStart(e) {
    e.dataTransfer.effectAllowed='move';
    e.dataTransfer.setData("Text", e.target.getAttribute("data-id"));
   // ev.dataTransfer.setDragImage(ev.target,100,100);
    return true;
  }

  function dragEnter(e) {
    e.preventDefault();
    return true;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function find_panel(el, name) {
    if (el.classList.contains(name)) {
      return el
    } else {
      return find_panel(el.parentNode, name)
    }
  }
  
  function insertEl(target, el) {
    target = find_panel(target, "friends-panel");
    if (target.children.length) {
      for (let i = 0; i < target.children.length; i++) {
        if (target.children[i].getAttribute("data-sort") > el.getAttribute("data-sort")) {
          target.insertBefore(el, target.children[i]);
          break;
        }
        if (i == target.children.length - 1) {
          target.appendChild(el);
        }
      }
    } else {
      target.appendChild(el);
    }
    search_friends("friends");
    search_friends("save");
  }
  
  for (let i=0; i < flist.children.length; i++) {
    if (userList.indexOf(flist.children[i].getAttribute("data-id"))>=0) {
      insertEl(slist, flist.children[i]);
    }
  }


  function dragDrop(e) {
    var data = e.dataTransfer.getData("Text");
    insertEl(e.target, document.querySelector("[data-id='"+data+"']"));
    e.stopPropagation(); 
    return false;
  }

  function move(e) {
    if (e.target.classList.contains("cross")) {
      if (e.target.parentNode.parentNode.parentNode.classList.contains("save")) {
        insertEl(flist, e.target.parentNode);
      } else {
        insertEl(slist, e.target.parentNode);
      }
    }
  }
  
  function getSaveList() {
    let res = [];
    for (let i = 0; i < slist.children.length; i++) {
      res.push(slist.children[i].getAttribute("data-id"));
    }
    return res
  }
  
  fsearch.addEventListener('keyup', () => search_friends('friends') );
  ssearch.addEventListener('keyup', () => search_friends('save') );
  plists.addEventListener('click', move);
  btn.addEventListener('click', () => {
    let dict = {};
    dict[document.getElementById('friendItemTemplate').getAttribute("data-uid")] = getSaveList();
    store.data = JSON.stringify(dict);
  });
  window.dragEnter = dragEnter;
  window.dragOver = dragOver;
  window.dragDrop = dragDrop;
  window.dragStart = dragStart;

}).catch(function(e) {
  console.log(`Ошибка: ${e.message}`);
});


},{}]},{},[1])