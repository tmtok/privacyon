const webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Key = webdriver.Key,
  t = require('selenium-webdriver/testing');
const expect = require('expect.js');
const assert = require('assert');
const async = require('async');
let driver;
var timer;

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

async function main(username, password) {
  driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  await driver.get('https://www.google.co.jp/')

  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//a[@id="gb_70"]'), 1000)));
  await driver.findElement(By.xpath('//a[@id="gb_70"]')).click();

  console.log("username : " + username + " pass : " + password);

  //input username
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="identifierId"]'), 1000)));
  await driver.findElement(By.xpath('//input[@id="identifierId"]')).sendKeys(username);
  await driver.findElement(By.xpath('//div[@id="identifierNext"]')).click();

  //input password
  await new Promise(resolve => setTimeout(resolve, 1000));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@name="password" and @type="password"]'), 1000)));
  await driver.findElement(By.xpath('//input[@name="password" and @type="password"]')).sendKeys(password);
  await driver.findElement(By.xpath('//div[@id="passwordNext"]')).click();


}

async function setting(index){
  await new Promise(resolve => setTimeout(resolve, 1000));
  await driver.get('https://myaccount.google.com/activitycontrols');
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//body[@id="yDmH0d"]'), 1000))).catch(function(err) {
    console.log("activitycontrols error");
  });

  await editCheckbox(false, 1); //webActivity
  await editCheckbox(true, 2); //location history
  await editCheckbox(false, 7); // device information
  await editCheckbox(true, 5); // voice activity
  await editCheckbox(true, 3); // youtube search history
  await editCheckbox(false, 4); // youtube play history
  await editCustomAds(true);
  await driver.quit();
}

async function editCheckbox(toggle, sid) {
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="ilpChd" and @data-sid=\"' + sid + '\"]'), 1000))).catch(function(err) {
    console.log("find checkbox error");
  });
  const elem = await driver.findElement(By.xpath('//div[@jsname="ilpChd" and @data-sid=\"' + sid + '\"]'));
  var isChecked = toBoolean("false");
  await elem.getAttribute('aria-checked').then(function(val) {
    isChecked = toBoolean(val);
    // console.log("aria-checked sid : " + sid + " val(Boolean):" + toBoolean(val) + " val:" + val);
  }).catch(function(err) {
    console.log("aria-checked error " + err);
  })

  if ((isChecked == false && toggle == true) || (isChecked == true && toggle == false)) {
    await elem.click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@data-id="EBS5u"]/content/span'), 1000))).catch(function(err) {
      console.log("cannot find checkbox confirm " + err);
    })
    const e = await driver.findElement(By.xpath('//div[@data-id="EBS5u"]/content/span')).catch(function(err) {
      console.log("cannot find checkbox confirm 2 " + err);
    })
    await clickConfirmButton(e);

    async.whilst(
      function() {
        return driver.findElement(By.xpath('//div[@data-id="EBS5u"]/content/span')).then(function(data) {
          return true;
        }).catch(function(err) {
          return false;
        })
      },
      function(callback) {

      },
      function(err, n) {
        console.log("error whilst : " + err);
      }
    );
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function editCustomAds(toggle){
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.get('https://adssettings.google.com/authenticated');
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="ornU0b"]'), 1000))).catch(function(err) {
    console.log("activitycontrols error");
  });
  const elem = await driver.findElement(By.xpath('//div[@jsname="ornU0b"]'), 1000);
  var isChecked = toBoolean("false");
  await elem.getAttribute('aria-checked').then(function(val){
    isChecked = toBoolean(val);
  }).catch(function(err){

  })

  if ((isChecked == false && toggle == true) || (isChecked == true && toggle == false)) {
    await elem.click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="j6LnYe"]/content/span'), 1000))).catch(function(err) {
      console.log("cannot find checkbox confirm " + err);
    })
    const e = await driver.findElement(By.xpath('//div[@jsname="j6LnYe"]/content/span')).catch(function(err) {
      console.log("cannot find checkbox confirm 2 " + err);
    })
    await clickConfirmButton(e);

    async.whilst(
      function() {
        return driver.findElement(By.xpath('//div[@jsname="j6LnYe"]/content/span')).then(function(data) {
          return true;
        }).catch(function(err) {
          return false;
        })
      },
      function(callback) {

      },
      function(err, n) {
        console.log("error whilst : " + err);
      }
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}


async function clickConfirmButton(e) {
  try {
    const a = await (() => {
      return new Promise((resolve, reject) => {
        setInterval(function() {
          e.click().then(function(data) {
            // console.log("click!! confirm button");
          }).catch(function(err) {
            clearInterval(this);
            resolve("");
          })
        }, 2000);
      })
    })();
    // return console.log(a);
  } catch (err) {
    return console.error("clickConfirmButton error : " + err);
  }
}

function toBoolean(str) {
  return (str == 'true') ? true : false;
}



var username = "kihalllllo";
var password = "ekuadoru";

exports.login = function(user, pass) {
  username = user;
  password = pass;
  main(username,password)
    .then((result) => {
      return true;
    });
}

exports.privacy_setting = function(index) {
  setting(index)
    .then((result) => {
      return true;
    })
}

// main(username, password)
//   .then((result) => {
//
//   });
