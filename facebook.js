const webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Key = webdriver.Key,
  Builder = webdriver.Builder,
  t = require('selenium-webdriver/testing');
const expect = require('expect.js');
const assert = require('assert');
const async = require('async');
const chrome = require('selenium-webdriver/chrome');
let driver;
var timer;

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

async function main(username, password) {
  // driver = await new webdriver.Builder()
  //   .withCapabilities(webdriver.Capabilities.chrome())
  //   .setChromeOptions(new chrome.Options().addArguments("--disable-notifications"))
  //   .build();
  driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments("--disable-notifications"))
    .build();

  await driver.get('https://www.facebook.com/');

  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="email"]'), 1000)));
  // await driver.findElement(By.xpath('//a[@id="gb_70"]')).click();

  //input username
  // await driver.findElement(By.xpath('//input[@id="email"]')).sendKeys(username);
  // await driver.findElement(By.xpath('//input[@id="pass"]')).sendKeys(password);
  // await driver.findElement(By.xpath('//input[@id="pass"]')).sendKeys(Key.ENTER);
}

async function setting(index) {
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="userNav"]'), 1000))).catch(function(err) {
    console.log("a " + err);
  })

  await driver.get('https://www.facebook.com/settings?tab=privacy').catch(function(err) {
    console.log("b : " + err);
  })

  switch (index) {
    case 0:
      await editPrivacySettings("privacy", "composer", "onlyMe");
      await editPrivacySettings("privacy", "canfriend", "friendsOfFriends");
      await editPrivacySettings("privacy", "friendlist", "onlyMe");
      await editPrivacySettings("privacy", "findemail", "onlyMe");
      await editPrivacySettings("privacy", "findphone", "onlyMe");
      break;
    case 1:
      await editPrivacySettings("privacy", "composer", "friends");
      await editPrivacySettings("privacy", "canfriend", "friendsOfFriends");
      await editPrivacySettings("privacy", "friendlist", "friends");
      await editPrivacySettings("privacy", "findemail", "friends");
      await editPrivacySettings("privacy", "findphone", "friends");

      break;
    case 2:
      await editPrivacySettings("privacy", "composer", "onlyMe");
      await editPrivacySettings("privacy", "canfriend", "friendsOfFriends");
      await editPrivacySettings("privacy", "friendlist", "onlyMe");
      await editPrivacySettings("privacy", "findemail", "friends");
      await editPrivacySettings("privacy", "findphone", "friends");

      break;
    case 3:
      await editPrivacySettings("privacy", "composer", "onlyMe");
      await editPrivacySettings("privacy", "canfriend", "friendsOfFriends");
      await editPrivacySettings("privacy", "friendlist", "onlyMe");
      await editPrivacySettings("privacy", "findemail", "friends");
      await editPrivacySettings("privacy", "findphone", "friends");

      break;
    case 4:
      await editPrivacySettings("privacy", "composer", "public");
      await editPrivacySettings("privacy", "canfriend", "public");
      await editPrivacySettings("privacy", "friendlist", "public");
      await editPrivacySettings("privacy", "findemail", "public");
      await editPrivacySettings("privacy", "findphone", "public");
      break;
  }
  // await editPrivacySettings("search", "public");
  // await new Promise(resolve => setTimeout(resolve, 2000));

  await driver.get('https://www.facebook.com/settings?tab=timeline').catch(function(err) {
    console.log("b : " + err);
  })

  await editPrivacySettings("timeline", "posting", "friends");
  await new Promise(resolve => setTimeout(resolve, 2000));


  await driver.get('https://www.facebook.com/settings?tab=followers').catch(function(err) {
    console.log("b : " + err);
  })

  await editPrivacySettings("timeline", "posting", "friends");
  await new Promise(resolve => setTimeout(resolve, 2000));


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

async function editPrivacySettings(pagename, name, whocansee) {
  var sectionName;

  await driver.findElement(By.xpath('//a[@href="/settings?tab=' + pagename + '&section=' + name + '"]')).then(function(e) {
    e.click();
  }).catch(function(err) {
    console.log("edit : " + err);
  })
  await new Promise(resolve => setTimeout(resolve, 2000));

  var ownerid;
  await driver.findElement(By.xpath('//a[contains(@aria-label, "プライバシー設定")]')).then(function(e) {
    e.getAttribute('id').then(function(id) {
      ownerid = id;
      console.log("id : " + id);
    }).catch(function(er) {
      console.log("er : " + er);
    })
    e.click();
  }).catch(function(err) {
    console.log("aaa " + err);
  })
  // await new Promise(resolve => setTimeout(resolve, 2000));
  // const publishingRange = await driver.findElement(By.xpath('//div[@class="_6a _43_1 _21o-"]')).then(function(e) {
  //   console.log("click A");
  //   e.click();
  // }).catch(function(err) {
  //   console.error("error A : " + err);
  // })

  await new Promise(resolve => setTimeout(resolve, 2000));
  var publicClassName;
  switch (whocansee) {
    case "public":
      publicClassName = "_4pmk";
      break;
    case "friends":
      publicClassName = "_2930";
      break;
    case "friendsOfFriends":
      publicClassName = "_1z-t";
      break;
    case "onlyMe":
      publicClassName = "_2932";
      break;
    default:
  }


  // await driver.findElement(By.xpath('//li[contains(@class, "' + publicClassName + '")]/a/span/span[@class="_54nh _4chm _48u0"]')).then(function(e) {
  await driver.findElement(By.xpath('//div[@data-ownerid="' + ownerid + '"]/div/div/div/div/div/div/div/ul/li[contains(@class, "' + publicClassName + '")]/a')).then(function(e) {
    driver.executeScript("arguments[0].click()", e);
  }).catch(function(err) {
    console.log("edit : " + err);
  })
  await new Promise(resolve => setTimeout(resolve, 2000));
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



// var username = "iamas2017tanami@gmail.com";
// var password = "netlife2018";
var username = "yoroiomedetou@gmail.com";
var password = "ekuadoru0727";

// main(username, password)
//   .then((result) => {
//
//   });

exports.login = function(user, pass) {
  username = user;
  password = pass;
  main(username, password)
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
