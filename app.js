var port = process.env.PORT || 5000,
  http = require("http"),
  express = require("express"),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  fs = require('fs'),
  twitterMod = require('./twitter'),
  googleMod = require('./google'),
  facebookMod = require('./facebook');

app.use(express.static(__dirname + "/html"))
server.listen(port);
console.log("http server listening on %d", port);

var facebookEnabled = false;
var twitterEnabled = false;
var googleEnabled = false;

io.sockets.on('connection', function (socket) {
  console.log("connect");
  socket.on('emit_from_client', function (data) {
    console.log("receive");
    socket.emit('console_out', data);
  });
  socket.on('test', function (data) {
    console.log(data);
  })

  socket.on('sign_up', function (data) {
    if (data.faceMailAddress != "" && data.facePassword != "") {
      facebookMod.login(data.faceMailAddress, data.facePassword);
      // console.log("received username : " + data.googleMailAddress + " pass : " + data.googlePassword);
      facebookEnabled = true;
    }
    if (data.googleMailAddress != "" && data.googlePassword != "") {
      googleMod.login(data.googleMailAddress, data.googlePassword).then(function (text) {
        console.log("google login result : " + text);
      }).catch(function (err) {
        console.log("error : " + err);
      })
      googleEnabled = true;
    }
    if (data.twitterUsername != "" && data.twitterPassword != "") {
      console.log("twitter login : " + data.twitterUsername + " " + data.twitterPassword);
      twitterMod.login(data.twitterUsername, data.twitterPassword);
      twitterEnabled = true;
    }
  })

  socket.on('select_lifestyle', function (index) {
    console.log("lifestyle : " + index);
    if (twitterEnabled == true) {
      twitterEnabled = false;
      twitterMod.privacy_setting(index);
    }
    if (googleEnabled == true) {
      var text = googleMod.privacy_setting(index);
      console.log("google result : " + text);
      googleEnabled = false;
    }
    if (facebookEnabled == true) {
      facebookMod.privacy_setting(index);
      facebookEnabled = false;
    }
  })
});
