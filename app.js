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
var settingFailed = false;

io.sockets.on('connection', function (socket) {
  console.log("connect");
  socket.emit('test', "test");
  // sendSettingStatus(true);
  socket.on('emit_from_client', function (data) {
    console.log("receive");
    socket.emit('console_out', data);
  });
  socket.on('test', function (data) {
    console.log(data);
  })

  socket.on('sign_up', function (data) {
    settingFailed = false;
    if (data.faceMailAddress != "" && data.facePassword != "") {
      const a = facebookMod.login(data.faceMailAddress, data.facePassword).then(function (e) {
        console.log("facebook a : " + e);
      }).catch(function (err) {
        console.log("error facebook : " + err);
      })
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
      twitterMod.login(data.twitterUsername, data.twitterPassword).then(function (result) {
        console.log("[twitter] login : " + result);
      }).catch(function (err) {

      })
      twitterEnabled = true;
    }
  })

  socket.on('select_lifestyle', function (index) {
    console.log("lifestyle : " + index);
    if (twitterEnabled == true) {
      twitterMod.privacy_setting(index).then(function (result) {
        console.log("[twitter] privacy setting result : " + result);
        twitterEnabled = false;
        sendSettingStatus(result);
      }).catch((err) => {
        console.log("[twitter] privacy setting failed");        
        twitterEnabled = false;
        sendSettingStatus(false);
      })
    }
    if (googleEnabled == true) {
      googleMod.privacy_setting(index).then(function (result) {
        console.log("[google] privacy setting result : " + result);
        googleEnabled = false;
        sendSettingStatus(result);
      }).catch((err) => {
        console.log("[google] privacy setting failed");
        googleEnabled = false;
        sendSettingStatus(false);
      });
    }
    if (facebookEnabled == true) {
      facebookMod.privacy_setting(index).then((result) => {
        console.log("[facebook] privacy setting result : " + result);
        facebookEnabled = false;
        sendSettingStatus(result);
      }).catch((err) => {
        facebookEnabled = false;
        sendSettingStatus(false);
      })
    }
  })
});

function sendSettingStatus(result) {
  if (result && !twitterEnabled && !googleEnabled && !facebookEnabled && !settingFailed) {
    io.sockets.emit('setting_status', true);
  } else if (!result) {
    settingFailed = true;
    io.sockets.emit('setting_status', false);
  }
}