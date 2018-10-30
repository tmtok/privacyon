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
  //
  //input username
  await driver.findElement(By.xpath('//input[@id="email"]')).sendKeys(username);
  await driver.findElement(By.xpath('//input[@id="pass"]')).sendKeys(password);
  await driver.findElement(By.xpath('//input[@id="pass"]')).sendKeys(Key.ENTER);

  await new Promise(resolve => setTimeout(resolve, 1000));

}

async function setting(index){
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="userNav"]'), 1000))).catch(function(err) {
    console.log("a " + err);
  })

  await driver.get('https://www.facebook.com/settings?tab=privacy').catch(function(err) {
    console.log("b : " + err);
  })




  await driver.findElement(By.xpath('//a[@href="/settings?tab=privacy&section=friendlist"]')).then(function(e) {
    // driver.executeScript("arguments[0].click()", e);
    e.click();
  }).catch(function(err) {
    console.log("edit : " + err);
  })
  await new Promise(resolve => setTimeout(resolve, 2000));

  // editPrivacySettings('今後の投稿の共有範囲', "onlyMe");
  await driver.findElement(By.xpath('//a[contains(@aria-label, "プライバシー設定")]')).then(function(e) {
    e.click();
    // driver.executeScript("arguments[0].click()",e);
  }).catch(function(err) {
    console.log("aaa " + err);
  })

  await new Promise(resolve => setTimeout(resolve, 2000));
  await driver.findElement(By.xpath('//a[contains(@aria-label, "プライバシー設定")]')).then(function(e) {
    driver.actions({
      bridge: true
    }).move({
      x: 20,
      y: 100,
      duration: 100,
      origin: e
    }).click().perform();
    console.log("click publishing Range");
  }).catch(function(err) {
    console.error("error B : " + err);
  })
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

async function editPrivacySettings(settingtext, whocansee) {
  // let bookAnchor = await driver.findElement({
  //   partialLinkText: settingtext
  // }).catch(function(err) {
  //   console.log("find anchor : " + err);
  // })
  // let book = await driver.findElement(
  //   By.js(
  //     el => el.closest('.fbSettingsListLink'),
  //     bookAnchor
  //   )
  // ).catch(function(err) {
  //   console.log("find bool : " + err);
  // })
  // // const edit = await book.findElement({partialLinkText: '編集する'}).catch(function(err){
  // const edit = await book.findElement(By.xpath('//span/span[@class="fbSettingsListItemEditText"]')).then(function(e) {
  //   driver.executeScript("arguments[0].click()", e);
  // }).catch(function(err) {
  //   console.log("edit : " + err);
  // })

  await driver.findElement(By.xpath('//a[@href="/settings?tab=privacy&section=composer"]')).then(function(e) {
    // driver.executeScript("arguments[0].click()", e);
    e.click();
  }).catch(function(err) {
    console.log("edit : " + err);
  })
  await new Promise(resolve => setTimeout(resolve, 2000));



  await new Promise(resolve => setTimeout(resolve, 2000));
  const publishingRange = await driver.findElement(By.xpath('//div[@class="_6a _43_1 _21o-"]')).then(function(e) {
    console.log("click A");
    e.click();
  }).catch(function(err) {
    console.error("error A : " + err);
  })

  await new Promise(resolve => setTimeout(resolve, 2000));

  var posY = new Array();
  var publicClassName;
  switch (whocansee) {
    case "public":
      posY.push(60);
      publicClassName = "_4pmk";
      break;
    case "friends":
      posY.push(120);
      publicClassName = "_2930";
      break;
    case "friendsOfFriends":
      publicClassName = "_1z-t";
      posY.push(230);
      break;
    case "onlyMe":
      posY.push(270);
      posY.push(330);
      publicClassName = "_2932";
      break;
    default:
  }


  await driver.findElement(By.xpath('//li[contains(@class, "' + publicClassName + '")]/a/span/span[@class="_54nh _4chm _48u0"]')).then(function(e) {
    driver.executeScript("arguments[0].click()", e);
    // console.log("aa : " + e + " " + whocansee);
  }).catch(function(err) {
    console.log("edit : " + err);
  })


  // for (var i = 0; i < posY.length; i++) {
  //   console.log(i +  " posY : " + posY[i]);
  //   await driver.findElement(By.xpath('//ul[@role="menu"]/li/a/span/div/span[@]')).then(function(e) {
  //     driver.actions({
  //       bridge: true
  //     }).move({
  //       x: 0,
  //       y: 0,
  //       duration: 100,
  //       origin: e
  //     }).click().perform();
  //     console.log("click publishing Range");
  //   }).catch(function(err) {
  //     console.error("error B : " + err);
  //   })
  //   console.log("click completed " + i);
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  // }
}

async function editCustomAds(toggle) {
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.get('https://adssettings.google.com/authenticated');
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="ornU0b"]'), 1000))).catch(function(err) {
    console.log("activitycontrols error");
  });
  const elem = await driver.findElement(By.xpath('//div[@jsname="ornU0b"]'), 1000);
  var isChecked = toBoolean("false");
  await elem.getAttribute('aria-checked').then(function(val) {
    isChecked = toBoolean(val);
  }).catch(function(err) {

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
