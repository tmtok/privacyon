var port = process.env.PORT || 5000,
  http = require("http"),
  express = require("express"),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  fs = require('fs'),
  twitterMod = require('./twitter');

app.use(express.static(__dirname + "/html"))
server.listen(port);
console.log("http server listening on %d", port);


io.sockets.on('connection', function(socket) {
  console.log("connect");
  socket.on('emit_from_client', function(data) {
    console.log("receive");
    socket.emit('console_out', data);
  });
  socket.on('test', function(data) {
    console.log(data);
  })

  socket.on('sign_up', function(data) {
    if (data.twitterUsername != "" && data.twitterPassword != "") {
      twitterMod.login(data.twitterUsername, data.twitterPassword);
    }
  })

  socket.on('safetyfirst', function(data) {
    console.log("safetyfirst");
    twitterMod.privacy_setting(0);
  })
});
