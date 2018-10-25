var socket;

$(document).ready(function() {
  // var socket = io.connect("https://movinglight-settings.herokuapp.com/");
  socket = io.connect("http://localhost:5000");
  receiveSocket();
});

function receiveSocket() {
  socket.on("emit", function(data) {
    console.log("a");
    socket.emit("test","aaa");
  })
}
