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
  console.log("[login] google begin");
  driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  await driver.get('https://www.google.co.jp/')

  const window = driver.getWindowHandle();
  await driver.switchTo().window(window);
  await driver.manage().window().setRect({ 'x': 560, 'y': 0, 'width': 1120, 'height': 1050 });

  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//a[@id="gb_70"]'), 1000)));
  await driver.findElement(By.xpath('//a[@id="gb_70"]')).click();

  //input username
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="identifierId"]'), 1000)));
  await driver.findElement(By.xpath('//input[@id="identifierId"]')).sendKeys(username);
  await driver.findElement(By.xpath('//div[@id="identifierNext"]')).click();

  //input password
  await new Promise(resolve => setTimeout(resolve, 1000));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@name="password" and @type="password"]'), 1000)));
  await driver.findElement(By.xpath('//input[@name="password" and @type="password"]')).sendKeys(password);
  await driver.findElement(By.xpath('//div[@id="passwordNext"]')).click();


  await new Promise(resolve => setTimeout(resolve, 2000));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//h1[@id="headingText"]'), 1000))).catch(function (err) {

  });

  await driver.findElement(By.xpath('//h1[@id="headingText" and @jsname="z6sL2b"]')).getText().then(function (text) {
    if (text == "本人であることの確認") {
      console.log("本人認証error");
    }
    console.log("text : " + text);
    driver.quit();
    return text;
  }).catch(function (err) {

  });


  // async.whilst(
  //   function() {
  //     driver.findElement(By.xpath('//h1[@id="headingText"]')).getText().then(function(text) {
  //       console.log("text : " + text);
  //       if(text == "本人であることの確認"){
  //         return true;
  //         console.log("auth error : 本人認証が必要です");
  //       }else if(text == "ようこそ"){
  //         return false;
  //       }
  //     }).catch(function(err) {
  //     })
  //   },
  //   function(callback) {
  //
  //   },
  //   function(err, n) {
  //     console.log("error whilst : " + err);
  //   }
  // );
  // await driver.findElement(By.xpath('//h1[@id="headingText"]')).getText().then(function(text){
  //   console.log("text : " + text);
  //   if(text == "本人であることの確認"){
  //     console.log("auth error : 本人認証が必要です");
  //     driver.quit();
  //   }
  // }).catch(function(err){
  //
  // })


  // await driver.quit();
  return "";
}

async function setting(index) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  await driver.get('https://myaccount.google.com/activitycontrols');
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//body[@id="yDmH0d"]'), 1000))).catch(function (err) {
    console.log("activitycontrols error");
  });

  switch (index) {
    case 0:
    case 1:
      await editCheckbox(false, 1); //webActivity
      await editCheckbox(false, 2); //location history
      await editCheckbox(false, 7); // device information
      await editCheckbox(false, 5); // voice activity
      await editCheckbox(false, 3); // youtube search history
      await editCheckbox(false, 4); // youtube play history
      // await editCheckbox(true,4); // custom ads
      await editCustomAds(false);
      break;
    case 2:
      await editCheckbox(false, 1); //webActivity
      await editCheckbox(false, 2); //location history
      await editCheckbox(false, 7); // device information
      await editCheckbox(false, 5); // voice activity
      await editCheckbox(true, 3); // youtube search history
      await editCheckbox(true, 4); // youtube play history
      await editCustomAds(true);
      break;
    case 3:
    case 4:
      await editCheckbox(true, 1); //webActivity
      await editCheckbox(true, 2); //location history
      await editCheckbox(true, 7); // device information
      await editCheckbox(true, 5); // voice activity
      await editCheckbox(true, 3); // youtube search history
      await editCheckbox(true, 4); // youtube play history
      await editCustomAds(true);
      break;
    default:
      break;
  }


  await driver.get("https://aboutme.google.com/");
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="Wa08Re"]'), 1000))).catch(function (err) {
    console.log("aboutme page not found " + err);
  });

  await driver.findElement(By.xpath('//div[@jsname="Wa08Re"]/content/div')).then(function (e) {
    e.click();
  }).catch(function (err) {
    console.error("cannot click " + err);
  })

  await new Promise(resolve => setTimeout(resolve, 1000));

  // add information
  await driver.findElement(By.xpath('//div[@id="dwrFZd0"]')).then(function (e) {
    console.log("cancel add information");
  }).catch(function (err) {
    console.log("add information not found ");
  })

  await driver.findElement(By.xpath('//div[@jsname="LgbsSe"]')).then(function (e) {
    console.log("found");
    driver.executeScript("arguments[0].click()", e);
  }).catch(function (err) {
    console.log("aaa");
  })

  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      await editAboutmeSettings(false, "gender");
      await editAboutmeSettings(false, "birthday");
      break;
    case 4:
      await editAboutmeSettings(true, "gender");
      await editAboutmeSettings(true, "birthday");
      break;

    default:
      break;
  }
  return "";
}

async function editCheckbox(toggle, sid) {
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="ilpChd" and @data-sid=\"' + sid + '\"]'), 1000))).catch(function (err) {
    console.log("find checkbox error");
  });
  const elem = await driver.findElement(By.xpath('//div[@jsname="ilpChd" and @data-sid=\"' + sid + '\"]'));
  var isChecked = toBoolean("false");
  await elem.getAttribute('aria-checked').then(function (val) {
    isChecked = toBoolean(val);
    // console.log("aria-checked sid : " + sid + " val(Boolean):" + toBoolean(val) + " val:" + val);
  }).catch(function (err) {
    console.log("aria-checked error " + err);
  })

  if ((isChecked == false && toggle == true) || (isChecked == true && toggle == false)) {
    await elem.click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@data-id="EBS5u"]/content/span'), 1000))).catch(function (err) {
      console.log("cannot find checkbox confirm " + err);
    })
    const e = await driver.findElement(By.xpath('//div[@data-id="EBS5u"]/content/span')).catch(function (err) {
      console.log("cannot find checkbox confirm 2 " + err);
    })
    await clickConfirmButton(e);

    async.whilst(
      function () {
        return driver.findElement(By.xpath('//div[@data-id="EBS5u"]/content/span')).then(function (data) {
          return true;
        }).catch(function (err) {
          return false;
        })
      },
      function (callback) {

      },
      function (err, n) {
        console.log("error whilst : " + err);
      }
    );
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function editCustomAds(toggle) {
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.get('https://adssettings.google.com/authenticated');
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="ornU0b"]'), 1000))).catch(function (err) {
    console.log("activitycontrols error");
  });
  const elem = await driver.findElement(By.xpath('//div[@jsname="ornU0b"]'), 1000);
  var isChecked = toBoolean("false");
  await elem.getAttribute('aria-checked').then(function (val) {
    isChecked = toBoolean(val);
  }).catch(function (err) {

  })

  if ((isChecked == false && toggle == true) || (isChecked == true && toggle == false)) {
    await elem.click();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@jsname="j6LnYe"]/content/span'), 1000))).catch(function (err) {
      console.log("cannot find checkbox confirm " + err);
    })
    const e = await driver.findElement(By.xpath('//div[@jsname="j6LnYe"]/content/span')).catch(function (err) {
      console.log("cannot find checkbox confirm 2 " + err);
    })
    await clickConfirmButton(e);

    async.whilst(
      function () {
        return driver.findElement(By.xpath('//div[@jsname="j6LnYe"]/content/span')).then(function (data) {
          return true;
        }).catch(function (err) {
          return false;
        })
      },
      function (callback) {

      },
      function (err, n) {
        console.log("error whilst : " + err);
      }
    );
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function editAboutmeSettings(isPublic, name) {

  await new Promise(resolve => setTimeout(resolve, 1000));
  await driver.findElement(By.xpath('//div[@jsname="Nzcbaf" and @data-key="' + name + '"]/div[@role="button"]')).then(function (e) {
    console.log("find ");
    driver.executeScript("arguments[0].click()", e);
  }).catch(function (err) {
    console.log("error : " + err);
  })

  var jslog = 15155;
  if (isPublic) {
    jslog = 15156;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  await driver.findElement(By.xpath('//div[@jslog="' + jslog + '; track:click"]')).then(function (e) {
    driver.actions({
      bridge: true
    }).move({
      x: 0,
      y: 0,
      origin: e
    }).click().perform();
    console.log("click");
    // driver.executeScript("arguments[0].click()", e);
  }).catch(function (err) {
    console.log("find anchor : " + err);

  })
  await new Promise(resolve => setTimeout(resolve, 1000));
}


async function clickConfirmButton(e) {
  try {
    const a = await (() => {
      return new Promise((resolve, reject) => {
        setInterval(function () {
          e.click().then(function (data) {
            // console.log("click!! confirm button");
          }).catch(function (err) {
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



var username = "";
var password = "";

exports.login = async function (user, pass) {
  username = user;
  password = pass;
  await main(username, password)
    .then((result) => {
      return true;
    });
}

exports.privacy_setting = async function (index) {
  await setting(index)
    .then((result) => {
      return true;
    })
}

// main(username, password)
//   .then((result) => {
//
//   });
