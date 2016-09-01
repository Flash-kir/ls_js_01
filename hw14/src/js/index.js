// создать подключение
var socket = new WebSocket("ws://localhost:8081"),
    View = {
    render: function(templateName, model) {
        templateName = templateName + 'Template';

        var templateElement = document.getElementById(templateName),
            templateSource = templateElement.innerHTML,
            renderFn = Handlebars.compile(templateSource);
        // console.log(renderFn(model));
        return renderFn(model);
    }
};
// отправить сообщение из формы publish 
document.addEventListener('click', function(event) {
  if ( event.target == document.getElementById("submit") ) {
    var outgoingMessage = document.getElementById("text").value;
    document.getElementById("text").value = "";
    socket.send(outgoingMessage);
    return false;
  }
});

// обработчик входящих сообщений
socket.onmessage = function(event) {
  var incomingMessage = event.data;
  showMessage(incomingMessage);
};

// показать сообщение в div#subscribe
function showMessage(message) {
  var messageElem = document.createElement('div');
  messageElem.classList.add("message-blk");
  messageElem.innerHTML = View.render('message', {name: "Имя Чела", nick_name: "nick", photo: 'http://lorempixel.com/50/50/people', text: message, time: new Date().toLocaleString()});
  document.getElementById('subscribe').appendChild(messageElem);
}