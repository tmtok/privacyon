var socket;
// var thisURL = "https://privacyon.herokuapp.com";
var thisURL = "http://192.168.1.121:5000";

$(document).ready(function () {
  // var socket = io.connect("https://movinglight-settings.herokuapp.com/");
  socket = io.connect(thisURL);

  receiveSocket();

  $('#signupButton').on('click', function () {
    var obj = new Object();
    if (document.getElementById("faceCheckBox").checked == true) {
      obj.faceMailAddress = document.getElementById('faceMailAddress').value;
      obj.facePassword = document.getElementById('facePassword').value;
    } else {
      obj.faceMailAddress = "";
      obj.facePassword = "";
    }
    if (document.getElementById("twitterCheckBox").checked == true) {
      obj.twitterPassword = document.getElementById('twitterPassword').value;
      obj.twitterUsername = document.getElementById('twitterUsername').value;
    } else {
      obj.twitterPassword = "";
      obj.twitterUsername = "";
    }
    if (document.getElementById("googleCheckBox").checked == true) {
      obj.googlePassword = document.getElementById('googlePassword').value;
      obj.googleMailAddress = document.getElementById('googleMailAddress').value;
    } else {
      obj.googlePassword = "";
      obj.googleMailAddress = "";
    }
    console.log(obj.faceMailAddress);
    socket.emit('sign_up', obj);
  })

  $('#select_safetyfirst').on('click', function () {
    console.log("pressed safetyfirst");
    socket.emit('select_lifestyle', 0);
  })

  $('#select_friendsforever').on('click', function () {
    console.log("pressed friendsforever");
    socket.emit('select_lifestyle', 1);
  })

  $('#select_fastidiousmyway').on('click', function () {
    console.log("pressed fastidiousmyway");
    socket.emit('select_lifestyle', 2);
  })

  $('#select_greedtrend').on('click', function () {
    console.log("pressed greedtrend");
    socket.emit('select_lifestyle', 3);
  })

  $('#select_attentionseeker').on('click', function () {
    console.log("pressed attentionseeker");
    socket.emit('select_lifestyle', 4);
  })
});


/*-----------------------------------*/
/*  socket.io  */
/*-----------------------------------*/
function receiveSocket() {
  socket.on("console_out", function (data) {
    console.log("msg : " + data);
  })

  socket.on("setting_status", function (result) {
    console.log("received setting status : " + result);
    if (result == true) {
      window.location.href = '../settingcomplete.html';
    } else {
      window.location.href = '../settingerror.html';
    }
  })

  socket.on("transition_lifestyle",function(data){
    window.location.href = '../lifestyle.html';
  })

  socket.on("transition_setting",function(){
    window.location.href = '../setting.html';
  })

  socket.on("setting_end", function (index) {
    var lifestyleIndex = index + 1;
    console.log("received settting end : " + lifestyleIndex);
    window.location.href = '../finish' + lifestyleIndex + '.html';
  })
}
