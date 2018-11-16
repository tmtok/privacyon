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
const promise = require('selenium-webdriver').promise;
let driver;
var timer;

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

// ログイン処理
exports.login = async function (username, password) {
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments("--disable-notifications"))
    .build();

  const window = await driver.getWindowHandle();
  await driver.switchTo().window(window); // ウィンドウを最前面に
  await driver.manage().window().setRect({ 'x': 1020, 'y': 0, 'width': 560, 'height': 1050 }); // ウィンドウ位置を指定


  await driver.get('https://www.facebook.com/');

  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="email"]'), 1000))).then(function (e) {
    return true;
  }).catch(function (err) {
    return false;
  })

  // await driver.findElement(By.xpath('//a[@id="gb_70"]')).click();

  //アイパスを入力
  await driver.findElement(By.xpath('//input[@id="email"]')).sendKeys(username);
  await driver.findElement(By.xpath('//input[@id="pass"]')).sendKeys(password);
  await driver.findElement(By.xpath('//input[@id="pass"]')).sendKeys(Key.ENTER);
}

exports.privacy_setting = async function (index) {
  //------------------------------------
  // privacy settings
  //------------------------------------
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="userNav"]'), 1000))).catch(function (err) {
    console.log("a " + err);
    return false;
  })

  await driver.get('https://www.facebook.com/settings?tab=privacy').catch(function (err) {
    console.log("b : " + err);
    return false;
  })

  switch (index) {
    case 0:
    case 2:
    case 3:
      await editPrivacySettings("privacy", "composer", "自分のみ");
      await editPrivacySettings("privacy", "canfriend", "友達の友達");
      await editPrivacySettings("privacy", "friendlist", "自分のみ");
      await editPrivacySettings("privacy", "findemail", "友達");
      await editPrivacySettings("privacy", "findphone", "友達");
      // await editPrivacySettingsCheckbox("privacy", "search", false);
      break;
    case 1:
      await editPrivacySettings("privacy", "composer", "友達");
      await editPrivacySettings("privacy", "canfriend", "友達の友達");
      await editPrivacySettings("privacy", "friendlist", "友達");
      await editPrivacySettings("privacy", "findemail", "友達");
      await editPrivacySettings("privacy", "findphone", "友達");
      // await editPrivacySettingsCheckbox("privacy", "search", false);
      break;
    case 4:
      await editPrivacySettings("privacy", "composer", "公開");
      await editPrivacySettings("privacy", "canfriend", "公開");
      await editPrivacySettings("privacy", "friendlist", "公開");
      await editPrivacySettings("privacy", "findemail", "公開");
      await editPrivacySettings("privacy", "findphone", "公開");
      // await editPrivacySettingsCheckbox("privacy", "search", true);
      break;
  }
  await new Promise(resolve => setTimeout(resolve, 2000));

  //------------------------------------
  // timeline settings
  //------------------------------------
  await driver.get('https://www.facebook.com/settings?tab=timeline').catch(function (err) {
    console.log("b : " + err);
  })

  switch (index) {
    case 0:
    case 2:
    case 3:
      await editPrivacySettings("timeline", "posting", "自分のみ");
      await editPrivacySettings("timeline", "others", "自分のみ");
      await editPrivacySettings("timeline", "tagging", "自分のみ");
      await editPrivacySettings("timeline", "expansion", "自分のみ");
      // await editPrivacySettings("timeline", "suggestions", "自分のみ");
      break;
    case 1:
      await editPrivacySettings("timeline", "posting", "友達");
      await editPrivacySettings("timeline", "others", "友達");
      await editPrivacySettings("timeline", "tagging", "友達");
      await editPrivacySettings("timeline", "expansion", "自分のみ");
      // await editPrivacySettings("timeline", "suggestions", "自分のみ");
      break;
    case 4:
      await editPrivacySettings("timeline", "posting", "友達");
      await editPrivacySettings("timeline", "others", "公開");
      await editPrivacySettings("timeline", "tagging", "友達");
      await editPrivacySettings("timeline", "expansion", "自分のみ");
      break;

    default:
      break;
  }
  await new Promise(resolve => setTimeout(resolve, 2000));

  //------------------------------------
  // followers settings
  //------------------------------------
  await driver.get('https://www.facebook.com/settings?tab=followers').catch(function (err) {
    console.log("b : " + err);
  })
  var allowFollowersClassname = "";
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      allowFollowersClassname = "sx_9b8e80"; //friends
      break;

    case 4:
      allowFollowersClassname = "sx_99b28b"; //public
      break;

    default:
      break;
  }
  console.log("allowFollowersClassName : " + allowFollowersClassname);
  // allow followers 
  await clickElement("//a[contains(@class,'_4o_4 _p _4jy3 _517h _51sy')]").catch((err) => {

  })
  await new Promise(resolve => setTimeout(resolve, 1000));
  await clickElement("//a[@class='_54nc _54nu']/span/i[contains(@class,'" + allowFollowersClassname + "')]").catch((err) => {
  })
  await new Promise(resolve => setTimeout(resolve, 2000));



  //------------------------------------
  // ads settings
  //------------------------------------
  await driver.get('https://www.facebook.com/ads/preferences/?entry_product=ad_settings_screen').catch(function (err) {
    console.log("b : " + err);
  })

  await new Promise(resolve => setTimeout(resolve, 2000));

  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="yourinfo"]/div/div[@data-testid="ads_settings_expandable_profile"]'), 20000))).catch(function (err) {
    console.log("a " + err);
    return false;
  })

  await new Promise(resolve => setTimeout(resolve, 2000));

  await driver.findElement(By.xpath('//div[@id="yourinfo"]/div/div[@data-testid="ads_settings_expandable_profile"]')).then(function (e) {
    driver.executeScript("arguments[0].click()", e);
  }).catch(function (err) {
    console.log("edit : " + err);
  })

  await new Promise(resolve => setTimeout(resolve, 2000));
  switch (index) {
    case 0:
    case 1:
    case 2:
      editYourinfo("relationship", "false");
      editYourinfo("office", "false");
      editYourinfo("profession", "false");
      editYourinfo("academic_background", "false");
      break;
    case 3:
    case 4:
      editYourinfo("relationship", "true");
      editYourinfo("office", "true");
      editYourinfo("profession", "true");
      editYourinfo("academic_background", "true");
      break;
  }


  //----------------------------------------------
  // パートナーからのデータに基づく広告
  //----------------------------------------------
  await new Promise(resolve => setTimeout(resolve, 2000));
  await driver.findElement(By.xpath('//div[@id="settings"]/div/div[@data-testid="ads_settings_expandable_profile"]')).then(function (e) {
    console.log("clicked allow third party");
    // e.click();
    // driver.executeScript("arguments[0].click()", e);
  }).catch(function (err) {
    console.log("edit : " + err);
  })

  await clickElement('//div[@data-testid="ads_settings_expandable_container"]').then((e) => {
  }).catch((err) => {
  })

  await clickElement('//div[@data-testid="ads_settings_third_party_selector"]/div/button').then((e) => {
  }).catch((err) => {
  })

  await new Promise(resolve => setTimeout(resolve, 2000));

  var allowThirdPartyId = "ads_settings_not_allow_third_party";
  switch (index) {
    case 3:
    case 4:
      allowThirdPartyId = "ads_settings_allow_third_party";
      break;
  }

  await clickElement('//li[@data-testid="' + allowThirdPartyId + '"]/div').then((e) => {
  }).catch((err) => {
    return false;
  })

  await new Promise(resolve => setTimeout(resolve, 3000));

  //--------------------------------------------
  // facebookグループ企業の製品でのアクティブティ...
  //--------------------------------------------
  await clickElement('//div[@class="_3-8p"]/div/div[@role="presentation"]').then((e) => {
  }).catch((err) => {
    return false;
  })

  await clickElement('//div[@class="_3-8p"]/div/div/div/div[@class="_3-8y"]/div/button').then((e) => {
  }).catch((err) => {
    return false;
  })

  var thirdParty2Text = "許可しない";
  switch (index) {
    case 3:
    case 4:
      thirdParty2Text = "許可する";
      break;
  }

  await new Promise(resolve => setTimeout(resolve, 3000));

  await driver.findElement(By.xpath('//div[@class="_z4i"]/div/div/div/div/ul/li/div[@aria-checked="true"]/div')).getText().then((text) => {
    console.log("text : " + text);
    if (text != thirdParty2Text) {
      driver.findElement(By.xpath('//div[@class="_z4i"]/div/div/div/div/ul/li/div[@aria-checked="false"]/div')).then((ee) => {
        console.log("change completed");
        driver.executeScript("arguments[0].click()", ee);
      }).catch((errr) => {
      })
    }
    else {
      clickElement('//div[@class="_3-8p"]/div/div/div/div[@class="_3-8y"]/div/button').then((e) => {
      }).catch((err) => {
        return false;
      })
    }
  }).catch((err) => {
    console.log("cannot find : " + err);
    return false;
  })

  await new Promise(resolve => setTimeout(resolve, 3000));

  await clickElement('//div[@class="_3-8p"]/div/div[@role="presentation"]').then((e) => {
  }).catch((err) => {
    return false;
  })
  await new Promise(resolve => setTimeout(resolve, 1000));


  //-------------------------------
  // third party settings 3
  //-------------------------------
  await clickElement('//div[@class="_3-98"]/div/div[@role="presentation"]').then((e) => {
  }).catch((err) => {
    return false;
  })
  await new Promise(resolve => setTimeout(resolve, 1000));
  await clickElement('//div[@class="_3-98"]/div/div/div/div[contains(@class,"_3-8y")]/div/button').then((e) => {
  }).catch((err) => {
    return false;
  })

  var thirdParty3Text = "非公開";
  switch (index) {
    case 1:
    case 4:
      thirdParty3Text = "友達のみ";
      break;
  }

  await new Promise(resolve => setTimeout(resolve, 3000));

  await driver.findElement(By.xpath('//div[@class="_z4i"]/div/div/div/div/ul/li/div[@aria-checked="true"]/div')).getText().then((text) => {
    console.log("text : " + text);
    if (text != thirdParty3Text) {
      driver.findElement(By.xpath('//div[@class="_z4i"]/div/div/div/div/ul/li/div[@aria-checked="false"]/div')).then((ee) => {
        console.log("change completed");
        driver.executeScript("arguments[0].click()", ee);
      }).catch((errr) => {
        console.log("cannot click : " + errr);
      })
    }
  }).catch((err) => {
    console.log("cannot find : " + err);
    return false;
  })
  driver.quit();
  return true;
}

//------------------------------
// edit privacy settings
//------------------------------
async function editPrivacySettings(pagename, name, whocansee) {
  var sectionName;
  var alreadySelected = false;
  await driver.findElement(By.xpath('//a[@href="/settings?tab=' + pagename + '&section=' + name + '"]/span[@class="fbSettingsListItemContent fcg"]/div/div[@class="_nlm fwb"]')).getText().then((text) => {
    console.log("find current text : " + name + " : " + text + " : " + whocansee);
    if (whocansee == text) alreadySelected = true;
  });
  if (alreadySelected) return true;

  await driver.get('https://www.facebook.com/settings?tab=' + pagename + '&section=' + name + '&view').catch((err) => {
    console.log("cannot access privacysettings contents : " + pagename + " : " + name + " | " + err);
  })
  await new Promise(resolve => setTimeout(resolve, 2000));

  var ownerid;
  await driver.findElement(By.xpath('//a[contains(@aria-label, "プライバシー設定")]')).then(function (e) {
    e.getAttribute('id').then(function (id) {
      ownerid = id;
      console.log("id : " + id);
    }).catch(function (er) {
      console.log("er : " + er);
    })
    e.click();
  }).catch(function (err) {
    console.log("aaa " + err);
  })

  await new Promise(resolve => setTimeout(resolve, 2000));
  var publicClassName;
  switch (whocansee) {
    case "公開":
      publicClassName = "_4pml";
      // publicClassName = "_4pmk";
      break;
    case "友達":
      publicClassName = "_2930";
      break;
    case "友達の友達":
      publicClassName = "_1z-t";
      break;
    case "自分のみ":
      publicClassName = "_2932";
      break;
    default:
  }
  await driver.findElement(By.xpath('//div[@data-ownerid="' + ownerid + '"]/div/div/div/div/div/div/div/ul/li[contains(@class, "' + publicClassName + '")]/a')).then(function (e) {
    driver.executeScript("arguments[0].click()", e);
  }).catch(function (err) {
    console.log("edit : " + err);
  })
  await new Promise(resolve => setTimeout(resolve, 2000));
}



//---------------------------------------
// edit Ads (yourinfo)
//---------------------------------------
async function editYourinfo(name, value) {
  var index;
  switch (name) {
    case "relationship":
      index = 2;
      break;
    case "office":
      index = 3;
      break;
    case "profession":
      index = 4;
      break;
    case "academic_background":
      index = 7;
      break;
    default:
      break;
  }

  const elem = await driver.findElement(By.xpath('//div[@value="' + index + '" and @role="checkbox"]')).then(function (e) {
    e.getAttribute('aria-checked').then(function (ee) {
      if ((ee == "false" && value == "true") || (ee == "true" && value == "false")) {
        console.log("click !!");
        e.click();
      }
    }).catch(function (errr) {
      console.log("get attribute error : " + errr);
    })
  }).catch(function (err) {
    console.log("AAA : " + err);
  })
  await new Promise(resolve => setTimeout(resolve, 1000));
}


async function clickElement(xpath) {
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(xpath), 2000))).catch((err) => {
    console.error("wait error " + xpath);
  })
  await driver.findElement(By.xpath(xpath)).then((e) => {
    console.log("clicked " + xpath);
    driver.executeScript("arguments[0].click()", e);
    return true;
  }).catch((err) => {
    console.error("click error " + xpath);
    return false;
  });
  return true;
}

function toBoolean(str) {
  return (str == 'true') ? true : false;
}



// var username = "yoroiomedetou@gmail.com";
// var password = "ekuadoru0727";

