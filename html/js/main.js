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

  // $('#save-groupIndex').css('background-color', '#BBB');
  // $('#effect-save-id').css('background-color', '#BBB');
  // $('#effect-download').css('background-color', '#BBB');
  // $('#download-groupIndex').css('background-color', '#BBB');
  // $('#download-groupIndex').on('click', function() {
  //   if (!dlGroupIndexEnabled) {
  //     return false;
  //   }
  // });
  // $('#effect-download').on('click', function() {
  //   if (!effectDownloadEnabled) {
  //     return false;
  //   }
  // })
  // $('#scene-preset-button').on('click', function() {
  //   document.getElementById('scene-preset-button').disabled = true;
  // })

  receiveSocket();
  // sendSocket();

  $('#signupButton').on('click', function () {
    var obj = new Object();
    obj.faceMailAddress = document.getElementById('faceMailAddress').value;
    obj.facePassword = document.getElementById('facePassword').value;
    obj.twitterPassword = document.getElementById('twitterPassword').value;
    obj.twitterUsername = document.getElementById('twitterUsername').value;
    obj.googlePassword = document.getElementById('googlePassword').value;
    obj.googleMailAddress = document.getElementById('googleMailAddress').value;
    console.log(obj.faceMailAddress);
    socket.emit('sign_up', obj);
  })

  $('#select_safetyfirst').on('click', function () {
    console.log("pressed safetyfirst 2");
    // socket.emit('select_lifestyle', 0);
  })

  $('#select_attentionseeker').on('click', function () {
    console.log("pressed attentionseeker");
    socket.emit('select_lifestyle', 1);
  })

  $('#select_greedtrend').on('click', function () {
    console.log("pressed greedtrend");
    socket.emit('select_lifestyle', 2);
  })

  $('#select_fastidiousmyway').on('click', function () {
    console.log("pressed fastidiousmyway");
    socket.emit('select_lifestyle', 3);
  })

  $('#select_friendsforever').on('click', function () {
    console.log("pressed friendsforever");
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

}
