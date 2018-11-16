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
var lifestyleIndex = 0;

io.sockets.on('connection', function (socket) {
  console.log("connect");
  // socket.on('emit_from_client', function (data) {
  //   console.log("receive");
  //   socket.emit('console_out', data);
  // });
  // socket.on('test', function (data) {
  //   console.log(data);
  // })

  // 各サイトログイン処理
  socket.on('sign_up', function (data) {
    settingFailed = false;
    if (data.faceMailAddress != "" && data.facePassword != "") {
      const a = facebookMod.login(data.faceMailAddress, data.facePassword).then(function (result) {
        console.log("[facebook] login result : " + result);
      }).catch(function (err) {
        console.log("[facebook] login error : " + err);
      })
      facebookEnabled = true;
    }
    if (data.googleMailAddress != "" && data.googlePassword != "") {
      googleMod.login(data.googleMailAddress, data.googlePassword).then(function (result) {
        console.log("[google] login result : " + result);
      }).catch(function (err) {
        console.log("[google] login error : " + err);
      })
      googleEnabled = true;
    }
    if (data.twitterUsername != "" && data.twitterPassword != "") {
      twitterMod.login(data.twitterUsername, data.twitterPassword).then(function (result) {
        console.log("[twitter] login result : " + result);
      }).catch(function (err) {
        console.log("[twitter] login error : " + err);
      })
      twitterEnabled = true;
    }
  })

  // 各ライフスタイル設定処理
  socket.on('select_lifestyle', function (index) {
    console.log("lifestyle : " + index);
    lifestyleIndex = index;
    if (twitterEnabled == true) {
      twitterMod.privacy_setting(index).then(function (result) {
        console.log("[twitter] privacy setting result : " + result);
        twitterEnabled = false;
        sendSettingStatus(result);
      }).catch((err) => {
        console.log("[twitter] privacy setting failed " + err);        
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
        console.log("[google] privacy setting failed " + err);
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
        console.log("[facebook] privacy setting failed " + err);
        facebookEnabled = false;
        sendSettingStatus(false);
      })
    }
  })
});

function sendSettingStatus(result) {
  if (result && !twitterEnabled && !googleEnabled && !facebookEnabled && !settingFailed) {
    // 設定完了画面へ遷移
    io.sockets.emit('setting_status', true);
    // 設定完了画面の表示5秒後に、finish画面へ遷移
    setTimeout(function(){
      console.log("send setting_end " + lifestyleIndex);
      io.sockets.emit('setting_end',lifestyleIndex);
    },5000);
  } else if (!result) {
    // 設定失敗画面へ遷移
    settingFailed = true;
    io.sockets.emit('setting_status', false);
  }
}