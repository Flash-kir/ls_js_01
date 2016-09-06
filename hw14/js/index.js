(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// создать подключение
var View = {
        render: function(templateName, model) {
            templateName = templateName + 'Template';
    
            var templateElement = document.getElementById(templateName),
                templateSource = templateElement.innerHTML,
                renderFn = Handlebars.compile(templateSource);
            return renderFn(model);
        }
    },
    user_name = document.querySelector(".user-name"),
    user_nick = document.querySelector(".user-nick"),
    load_area = document.querySelector(".load-area"),
    user_list = document.querySelector(".user-list"),
    socket;

  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files,
        reader = new FileReader();
      console.log(files[0]);
      if (files[0].size > 512 * 1024) {
          load_area.innerHTML = "Файл не должен превышать 512 Kb";
        return false;
      } else if (files[0].type != "image/jpeg") {
          load_area.innerHTML = "Загружайте фото в формате JPEG";
        return false;
      }
        reader.onload = (function() {
            return function(e) {
                var img = document.createElement("img");
                img.src = e.target.result;
                load_area.innerHTML = "";
                load_area.appendChild(img);
            };
        })(files[0]);

      reader.readAsDataURL(files[0]);
  }
  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
  }
  function load_img(send) {
      if ( load_area.querySelector("img") ) {
          if (send) {
              socket.send(JSON.stringify({type: "photo",
                  user_name: user_name.value,
                  user_nick: user_nick.value,
                  src: load_area.querySelector("img").src,
                  user_photo: "media/img/logos/" + user_nick.value + ".jpg"
              }));
          }
          load_area.innerHTML = "<p>Перетащите сюда фото</p>";
      }
      top(id("load"), -500);
  }
  function showMessage(message) {
      var messageElem = document.createElement('div');
      messageElem.classList.add("message-blk");
      messageElem.innerHTML = View.render('message', message);
      id('subscribe').appendChild(messageElem);
  }
  function id(name) {
      return document.getElementById(name)
  }
  function top(el, top) {
      el.style.top = top + "px";
  }
  function changePhotos(msg) {
      var photos = document.querySelectorAll('[data-photo="' + msg.user_nick + '"]');
      for (var i = 0; i < photos.length; i++) {
          var photo = photos[i];
          photo.src = msg.user_photo;
      }
  }
  function writeList(msg) {
      id("user-list").querySelector(".number").innerHTML = msg.user.length;
      id("user-list").querySelector(".list").innerHTML = msg.user.join("");
  }

  load_area.addEventListener('dragover', handleDragOver, false);
  load_area.addEventListener('drop', handleFileSelect, false);
  id("load-btn").addEventListener('click', () => load_img(true));
  id("cancel-btn").addEventListener('click', () => load_img(false));

// отправить сообщение из формы publish 
document.addEventListener('click', function(event) {
  if ( event.target == id("submit") ) {
      var outgoingMessage = JSON.stringify({type: "text", text: document.getElementById("text").value,
          user_name: user_name.value,
          user_nick: user_nick.value,
          user_photo: id("user-photo").src,
          date: ""});
      id("text").value = "";
      socket.send(outgoingMessage);
  } else if ( event.target == id("login-btn") ) {
      if (user_name.value != '' && user_nick.value != '') {
          top(id("login"), -500);
          user_list.style.display = "block";
          id("user-name").innerText = user_name.value;
          id("user-photo").dataset.photo = user_nick.value;
          
          //Создаем подключение
          socket = new WebSocket("ws://localhost:8081");
          socket.onopen = () => {
              socket.send(JSON.stringify({type: 'login', user_nick: user_nick.value, user_name: user_name.value}))
          };

          // обработчик входящих сообщений
          socket.onmessage = function(event) {
              var incomingMessage = JSON.parse(event.data);
              switch (incomingMessage.type) {
                  case "text":
                      showMessage(incomingMessage);
                      break;
                  case "photo":
                      changePhotos(incomingMessage);
                      break;
                  case "login":
                      writeList(incomingMessage);
                      break;
              }
          };

          id("user-photo").addEventListener('click', () => top(id("load"), 0))
      }
  }
    return false;
});


},{}]},{},[1])