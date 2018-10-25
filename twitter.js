const webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until,
  Key = webdriver.Key,
  t = require('selenium-webdriver/testing');
const expect = require('expect.js');
const assert = require('assert');
const async = require('async');
let driver;
var username;
var password;
var isChangedSettings = false;

async function main() {
  driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  await driver.get('http://twitter.com')
  const name = await driver.findElement(By.xpath('//input[@name="session[username_or_email]"]'));
  const pass = await driver.findElement(By.xpath('//input[@name="session[password]"]'));
  // await name.sendKeys('test41003724');
  // await pass.sendKeys('123qwe');
  await name.sendKeys(username);
  await pass.sendKeys(password);
  await pass.sendKeys(Key.ENTER);
}

async function setting(index) {
  isChangedSettings = false;

  //==========================================
  // privacy and security
  //==========================================
  await driver.get('http://twitter.com/settings/safety');
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="user_protected"]'), 1000)));
  await new Promise(resolve => setTimeout(resolve, 2000));
  switch (index) {
    case 0:
      await editCheckbox(false, "user_protected");
      await editCheckbox(true, "user_geo_enabled");
      await editCheckbox(true, "user_discoverable_by_email");
      await editCheckbox(true, "user_mobile_discoverable");
      await editCheckbox(true, "allow_media_tagging_none");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_dms_from_anyone");
      await editCheckbox(true, "allow_dm_receipts");
      await editCheckboxName(true, "search-settings-nsfw");
      await editCheckboxName(true, "search-settings-blocked-accounts");      
      await editCheckbox(false, "user_nsfw_view");
      await editCheckbox(true, "user_nsfw_user");

      break;

    case 1:

    default:

  }
  if (isChangedSettings == true) {
    await saveSettings(true);
  }

  //==========================================
  // privacy and security (personalization)
  //==========================================
  await driver.get('https://twitter.com/settings/personalization');
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="allow_ads_personalization"]'), 1000)));
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (index) {
    case 0:
      await editCheckbox(true, "allow_ads_personalization");
      await editCheckbox(true, "allow_logged_out_device_personalization");
      await editCheckbox(true, "allow_location_history_personalization");
      await editCheckbox(true, "use_cookie_personalization");
      await editCheckbox(true, "allow_sharing_data_for_third_party_personalization");
      break;
    default:
  }
  if (isChangedSettings == true) {
    await saveSettings(false);
  }

  //==========================================
  // emain notifications
  //==========================================
  await driver.get('https://twitter.com/settings/email_notifications');
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="send_network_activity_email"]'), 1000)));
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (index) {
    case 0:
      // await editCheckbox(true, "notifications-optout-form");
      await editMailNotification(true);
      await editCheckbox(true, "send_network_activity_email");
      await editCheckbox(true, "send_new_direct_text_email");
      await editCheckbox(true, "send_shared_tweet_email");
      await editDropdown(true,"network_digest_schedule",'3');
      // await editCheckbox(true, "network-digest-schedule-dropdown"); network_digest_schedule

      await editCheckbox(true, "performance_digest_schedule");
      await editCheckbox(true, "send_email_newsletter");
      await editCheckbox(true, "send_activation_email");
      await editCheckbox(true, "send_resurrection_email_1");
      await editCheckbox(true, "send_partner_email");
      await editCheckbox(true, "send_survey_email");
      await editCheckbox(true, "send_follow_recs_email");
      await editCheckbox(true, "send_similar_people_email");
      await editCheckbox(true, "send_smb_sales_marketing_email");
      break;
    default:
  }
  if (isChangedSettings == true) {
    await saveSettings(false);
  }

  //==========================================
  // notifications timeline
  //==========================================
  await driver.get('https://twitter.com/settings/notifications_timeline');
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="following_filter_enabled"]'), 1000)));
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (index) {
    case 0:
      await editCheckbox(true, "following_filter_enabled");
      await editCheckbox(true, "filter_not_followed_by_enabled");
      await editCheckbox(true, "filter_new_users_enabled");
      await editCheckbox(true, "filter_default_profile_image_enabled");
      await editCheckbox(true, "filter_no_confirmed_email_enabled");
      await editCheckbox(true, "filter_no_confirmed_phone_enabled");
      await editCheckbox(true, "quality_filter_enabled");
      break;
    default:
  }
  if (isChangedSettings == true) {
    await saveSettings(false);
  }

}


//==========================================
// privacy settings
//==========================================
async function editCheckbox(toggle, id) {
  const elem = await driver.findElement(By.xpath('//input[@id=\"' + id + '\"]'));
  await elem.getAttribute('checked').then(function(val) {
    var bVal = Boolean(val);
    if ((bVal == false && toggle == true) || (bVal == true && toggle == false)) {
      elem.click();
      if (isChangedSettings != true) {
        isChangedSettings = true;
      }
    }
  })
  console.log("edited : " + id);
}

async function editCheckboxName(toggle, name) {
  const elem = await driver.findElement(By.xpath('//input[@name=\"' + name + '\"]'));
  await elem.getAttribute('checked').then(function(val) {
    var bVal = Boolean(val);
    if ((bVal == false && toggle == true) || (bVal == true && toggle == false)) {
      elem.click();
      if (isChangedSettings != true) {
        isChangedSettings = true;
      }
    }
  })
  console.log("edited : " + id);
}

async function editDropdown(toggle, id,val) {
  const elem = await driver.findElement(By.xpath('//select[@data-attribute=\"' + id + '\"]'));
  await elem.sendKeys(val).catch(function(err){
    console.log("dropdown error");
  })
}

async function editMailNotification(toggle) {
  var currentSettings = true;
  await driver.findElement(By.xpath('//span[@id="notifications-global-off"]')).catch(function(err){
    currentSettings = false;
  })
  console.log("mail notifications " + currentSettings + " : " + toggle);
  if((currentSettings == true && toggle == false) || (currentSettings == false && toggle == true)){
    if(currentSettings == true){
      console.log("current : " + currentSettings);
      await driver.findElement(By.xpath('//span[@id="notifications-global-off"]')).click();
    }else {
      console.log("current : " + currentSettings);
      await driver.findElement(By.xpath('//span[@id="notifications-global-on"]')).click();
    }
  }

}




async function saveSettings(confirm) {
  // save settings
  await new Promise(resolve => setTimeout(resolve, 1500));
  await driver.findElement(By.xpath("//button[@id='settings_save']")).click();

  if(confirm == true){
    const auth_pass = await driver.findElement(By.xpath("//input[@id='auth_password']"));
    await auth_pass.sendKeys(password);
    await auth_pass.sendKeys(Key.ENTER);
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="settings-alert-box"]'), 1000)));
  }
  // const auth_pass = await driver.findElement(By.xpath("//input[@id='auth_password']")).then(function(val) {
  //   val.sendKeys(password);
  // }).then(function(val2){
  //   val.sendKeys(Key.ENTER);
  // }).then(function(val3){
  //   driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="settings-alert-box"]'), 1000))).catch(function(err){
  //     return;
  //   })
  // }) .catch(function(err) {
  //   console.log("save error");
  //   isChangedSettings = false;
  // });



  // await driver.findElement(By.xpath("//input[@id='auth_password']")).sendKeys(password).catch(function(err){
  //   return;
  // })
  // // await new Promise(resolve => setTimeout(resolve, 500));
  // await driver.findElement(By.xpath("//input[@id='auth_password']")).sendKeys(Key.ENTER).catch(function(err){
  //   return;
  // })
  //
  // await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="settings-alert-box"]'), 1000))).catch(function(err){
  //   console.log("save not completed");
  //   return;
  // })
  // console.log("save complete");
  // // await driver.await(until.elementIsVisible(driver.findElement(By.xpath('//div[@id="settings-alert-box"]'), 1000)));
  // isChangedSettings = false;
}



exports.login = function(user, pass) {
  username = user;
  password = pass;
  main()
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
