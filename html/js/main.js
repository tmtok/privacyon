var socket;
// var thisURL = "https://privacyon.herokuapp.com";
var thisURL = "http://localhost:5000";

var loadSheetEnabled = true;
var saveGroupIndexEnabled = false;
var dlGroupIndexEnabled = false;
var effectSaveIdEnabled = false;
var effectDownloadEnabled = false;
var elInstallationDropArea;
var elInstallationFile;
var elUniverse;
var elTrash;
var reader = new FileReader();
var readFileContentsList = new Array();
var readFileNameList = new Array();
var readFileIndexList = new Array();

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
    console.log("pressed safetyfirst 2 AAA");
    socket.emit('select_lifestyle', 0);
  })

  $('#select_attentionseeker').on('click', function () {
    console.log("pressed attentionseeker");
    socket.emit('select_lifestyle', 4);
  })

  $('#select_greedtrend').on('click', function () {
    console.log("pressed greedtrend");
    socket.emit('select_lifestyle', 3);
  })

  $('#select_fastidiousmyway').on('click', function () {
    console.log("pressed fastidiousmyway");
    socket.emit('select_lifestyle', 2);
  })

  $('#select_friendsforever').on('click', function () {
    console.log("pressed friendsforever");
    socket.emit('select_lifestyle', 1);
  })

});


/*-----------------------------------*/
/*  socket.io  */
/*-----------------------------------*/
function receiveSocket() {
  socket.on("console_out", function (data) {
    console.log("msg : " + data);
  })

  socket.on("test",function(data){
    console.log("test : " + data);
  })

  socket.on("setting_status",function(result){
    console.log("received setting status : " + result);
    if(result == true){
      window.location.href = '../settingcomplete.html';
    }else {
      window.location.href = '../settingerror.html';
    }
  })

}
