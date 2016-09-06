var WebSocketServer = new require('ws'),
    fs = require('fs');

// подключенные клиенты
var clients = {}, list = [], messages = [], users = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
  port: 8081
});
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = {};
  clients[id]['ws'] = ws;
  for (var i = 0; i < messages.length; i++) {
    ws.send(messages[i]);
  }

  ws.on('message', function(message) {
    var msg = JSON.parse(message);
    msg.date = new Date().toLocaleString();
    if (!users[msg.user_nick]) {
      users[msg.user_nick] = {}
    }
    if (msg.type == "login") {
      if (list.indexOf('<p>' + msg.user_name + '</p>') == -1) {
        list.push('<p>' + msg.user_name + '</p>');
        msg.user = list;
        clients[id]['user'] = msg.user_name;
      } else {
        msg.logout = true
      }
    }
    if (msg.type == "photo") {
      fs.open("media/img/logos/" + msg.user_nick + ".jpg", "w", (err, fd) => {
        fs.writeFile("media/img/logos/" + msg.user_nick + ".jpg", msg.src.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/,""), 'base64');
        users[msg.user_nick]['photo'] = "media/img/logos/" + msg.user_nick + ".jpg?" + Math.random();
      });
    }
    if (users[msg.user_nick]) {
      if (users[msg.user_nick]['photo'] != msg.user_photo && users[msg.user_nick]['photo']) {
        msg.user_photo = users[msg.user_nick]['photo'];
      }
    }

    message = JSON.stringify(msg);
    console.log('получено сообщение ' + message);
    messages.push(message);
    for (var key in clients) {
      clients[key]['ws'].send(message);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    list.splice(list.indexOf(clients[id].user), 1);
    delete clients[id];
    for (var key in clients) {
      clients[key]['ws'].send(JSON.stringify({type: "login", user: list}));
    }
  });

});