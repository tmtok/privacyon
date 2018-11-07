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

exports.login = async function(user, pswd) {
  username = user;
  password = pswd;
  console.log("[login] twitter begin");
  driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  const window = await driver.getWindowHandle();
  await driver.switchTo().window(window);
  await driver.manage().window().setRect({ 'x': 0, 'y': 0, 'width': 560, 'height': 1050 });


  await driver.get('http://twitter.com/login')
  await new Promise(resolve => setTimeout(resolve, 2000));
  await driver.findElement(By.xpath('//input[@name="session[username_or_email]" and @class="js-username-field email-input js-initial-focus"]')).then(function (e) {
    console.log("send username");
    e.sendKeys(username).catch(function (errr) {
      console.log("ERROR : " + errr);
    })
  }).catch(function (err) {
    console.log("[twitter] username form not found " + err);
  })
  const pass = await driver.findElement(By.xpath('//input[@name="session[password]" and @class="js-password-field"]')).catch(function (err) {
    console.log("[twitter] password form not found " + err);
  })
  // await name.sendKeys('test41003724');
  // await pass.sendKeys('123qwe');
  await pass.sendKeys(password);
  await pass.sendKeys(Key.ENTER);
}

exports.privacy_setting = async function(index) {
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
      await editCheckbox(false, "user_geo_enabled");
      await editCheckbox(false, "user_discoverable_by_email");
      await editCheckbox(false, "user_mobile_discoverable");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_media_tagging_none");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_contributor_request_none");
      await editCheckbox(false, "allow_dms_from_anyone");
      await editCheckbox(false, "allow_dm_receipts");
      await editCheckboxName(true, "search-settings-nsfw");
      await editCheckboxName(true, "search-settings-blocked-accounts");
      await editCheckbox(true, "user_nsfw_view");
      await editCheckbox(false, "user_nsfw_user");
      break;

    case 1:
      await editCheckbox(true, "user_protected");
      await editCheckbox(false, "user_geo_enabled");
      await editCheckbox(true, "user_discoverable_by_email");
      await editCheckbox(true, "user_mobile_discoverable");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_media_tagging_none");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_contributor_request_none");
      await editCheckbox(false, "allow_dms_from_anyone");
      await editCheckbox(true, "allow_dm_receipts");
      await editCheckboxName(true, "search-settings-nsfw");
      await editCheckboxName(true, "search-settings-blocked-accounts");
      await editCheckbox(true, "user_nsfw_view");
      await editCheckbox(false, "user_nsfw_user");
      break;

    case 2:
      await editCheckbox(false, "user_protected");
      await editCheckbox(false, "user_geo_enabled");
      await editCheckbox(true, "user_discoverable_by_email");
      await editCheckbox(true, "user_mobile_discoverable");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_media_tagging_none");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_contributor_request_none");
      await editCheckbox(false, "allow_dms_from_anyone");
      await editCheckbox(false, "allow_dm_receipts");
      await editCheckboxName(true, "search-settings-nsfw");
      await editCheckboxName(true, "search-settings-blocked-accounts");
      await editCheckbox(false, "user_nsfw_view");
      await editCheckbox(false, "user_nsfw_user");
      break;

    case 3:
      await editCheckbox(false, "user_protected");
      await editCheckbox(true, "user_geo_enabled");
      await editCheckbox(false, "user_discoverable_by_email");
      await editCheckbox(false, "user_mobile_discoverable");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_media_tagging_none");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_contributor_request_none");
      await editCheckbox(false, "allow_dms_from_anyone");
      await editCheckbox(false, "allow_dm_receipts");
      await editCheckboxName(false, "search-settings-nsfw");
      await editCheckboxName(true, "search-settings-blocked-accounts");
      await editCheckbox(false, "user_nsfw_view");
      await editCheckbox(false, "user_nsfw_user");
      break;

    case 4:
      await editCheckbox(false, "user_protected");
      await editCheckbox(false, "user_geo_enabled");
      await editCheckbox(true, "user_discoverable_by_email");
      await editCheckbox(true, "user_mobile_discoverable");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_media_tagging_none");
      // allow_media_tagging_none , allow_media_tagging_following , allow_media_tagging_all
      await editCheckbox(true, "allow_contributor_request_none");
      await editCheckbox(true, "allow_dms_from_anyone");
      await editCheckbox(true, "allow_dm_receipts");
      await editCheckboxName(false, "search-settings-nsfw");
      await editCheckboxName(true, "search-settings-blocked-accounts");
      await editCheckbox(false, "user_nsfw_view");
      await editCheckbox(false, "user_nsfw_user");
      break;

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
      await editCheckbox(false, "allow_logged_out_device_personalization");
      await editCheckbox(false, "allow_location_history_personalization");
      await editCheckbox(false, "use_cookie_personalization");
      await editCheckbox(false, "allow_sharing_data_for_third_party_personalization");
      break;

    case 1:
      await editCheckbox(false, "allow_ads_personalization");
      await editCheckbox(false, "allow_logged_out_device_personalization");
      await editCheckbox(false, "allow_location_history_personalization");
      await editCheckbox(false, "use_cookie_personalization");
      await editCheckbox(false, "allow_sharing_data_for_third_party_personalization");
      break;

    case 2:
      await editCheckbox(true, "allow_ads_personalization");
      await editCheckbox(true, "allow_logged_out_device_personalization");
      await editCheckbox(false, "allow_location_history_personalization");
      await editCheckbox(true, "use_cookie_personalization");
      await editCheckbox(false, "allow_sharing_data_for_third_party_personalization");
      break;

    case 3:
    case 4:
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
  // email notifications
  //==========================================
  await driver.get('https://twitter.com/settings/email_notifications');
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="send_network_activity_email"]'), 1000)));
  await new Promise(resolve => setTimeout(resolve, 2000));

  await editMailNotification(true);
  await editCheckbox(false, "performance_digest_schedule");
  await editCheckbox(false, "send_email_newsletter");
  await editCheckbox(false, "send_activation_email");
  switch (index) {
    case 0:
      await editCheckbox(true, "send_network_activity_email");
      await editCheckbox(false, "send_new_direct_text_email");
      await editCheckbox(false, "send_shared_tweet_email");
      await editDropdown(false, "network_digest_schedule", '1');
      // await editCheckbox(true, "network-digest-schedule-dropdown"); network_digest_schedule
      await editCheckbox(false, "send_resurrection_email_1");
      await editCheckbox(false, "send_partner_email");
      await editCheckbox(false, "send_survey_email");
      await editCheckbox(false, "send_follow_recs_email");
      await editCheckbox(false, "send_similar_people_email");
      await editCheckbox(false, "send_smb_sales_marketing_email");
      break;
    case 1:
      await editCheckbox(true, "send_network_activity_email");
      await editCheckbox(true, "send_new_direct_text_email");
      await editCheckbox(true, "send_shared_tweet_email");
      await editDropdown(true, "network_digest_schedule", '1');
      // await editCheckbox(true, "network-digest-schedule-dropdown"); network_digest_schedule
      await editCheckbox(false, "send_resurrection_email_1");
      await editCheckbox(false, "send_partner_email");
      await editCheckbox(false, "send_survey_email");
      await editCheckbox(false, "send_follow_recs_email");
      await editCheckbox(false, "send_similar_people_email");
      await editCheckbox(false, "send_smb_sales_marketing_email");
      break;
    case 2:
      await editCheckbox(true, "send_network_activity_email");
      await editCheckbox(false, "send_new_direct_text_email");
      await editCheckbox(false, "send_shared_tweet_email");
      await editDropdown(false, "network_digest_schedule", '1');
      // await editCheckbox(true, "network-digest-schedule-dropdown"); network_digest_schedule
      await editCheckbox(false, "send_resurrection_email_1");
      await editCheckbox(false, "send_partner_email");
      await editCheckbox(false, "send_survey_email");
      await editCheckbox(true, "send_follow_recs_email");
      await editCheckbox(false, "send_similar_people_email");
      await editCheckbox(false, "send_smb_sales_marketing_email");
      break;
    case 3:
      await editCheckbox(true, "send_network_activity_email");
      await editCheckbox(false, "send_new_direct_text_email");
      await editCheckbox(false, "send_shared_tweet_email");
      await editDropdown(false, "network_digest_schedule", '1');
      // await editCheckbox(true, "network-digest-schedule-dropdown"); network_digest_schedule
      await editCheckbox(false, "send_resurrection_email_1");
      await editCheckbox(false, "send_partner_email");
      await editCheckbox(false, "send_survey_email");
      await editCheckbox(true, "send_follow_recs_email");
      await editCheckbox(false, "send_similar_people_email");
      await editCheckbox(false, "send_smb_sales_marketing_email");
      break;
    case 4:
      await editCheckbox(true, "send_network_activity_email");
      await editCheckbox(false, "send_new_direct_text_email");
      await editCheckbox(false, "send_shared_tweet_email");
      await editDropdown(false, "network_digest_schedule", '1');
      // await editCheckbox(true, "network-digest-schedule-dropdown"); network_digest_schedule
      await editCheckbox(true, "send_resurrection_email_1");
      await editCheckbox(false, "send_partner_email");
      await editCheckbox(false, "send_survey_email");
      await editCheckbox(false, "send_follow_recs_email");
      await editCheckbox(false, "send_similar_people_email");
      await editCheckbox(false, "send_smb_sales_marketing_email");
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
    case 1:
      await editCheckbox(true, "following_filter_enabled");
      await editCheckbox(true, "filter_not_followed_by_enabled");
      await editCheckbox(true, "filter_new_users_enabled");
      await editCheckbox(true, "filter_default_profile_image_enabled");
      await editCheckbox(true, "filter_no_confirmed_email_enabled");
      await editCheckbox(true, "filter_no_confirmed_phone_enabled");
      await editCheckbox(false, "quality_filter_enabled");
      break;
    case 2:
    case 3:
    case 4:
      await editCheckbox(false, "following_filter_enabled");
      await editCheckbox(false, "filter_not_followed_by_enabled");
      await editCheckbox(false, "filter_new_users_enabled");
      await editCheckbox(false, "filter_default_profile_image_enabled");
      await editCheckbox(false, "filter_no_confirmed_email_enabled");
      await editCheckbox(false, "filter_no_confirmed_phone_enabled");
      await editCheckbox(true, "quality_filter_enabled");
      break;
    default:
  }
  if (isChangedSettings == true) {
    await saveSettings(false);
  }
  driver.quit();
  return true;

}


//==========================================
// privacy settings
//==========================================
async function editCheckbox(toggle, id) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const elem = await driver.findElement(By.xpath('//input[@id=\"' + id + '\"]')).catch((err) =>{
    console.error("not found checkbox ID : " + err);
  })
  await elem.getAttribute('checked').then(function (val) {
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
  await elem.getAttribute('checked').then(function (val) {
    var bVal = Boolean(val);
    if ((bVal == false && toggle == true) || (bVal == true && toggle == false)) {
      elem.click();
      if (isChangedSettings != true) {
        isChangedSettings = true;
      }
    }
  })
  console.log("edited : " + name);
}

async function editDropdown(toggle, id, val) {
  const elem = await driver.findElement(By.xpath('//select[@data-attribute=\"' + id + '\"]'));
  await elem.sendKeys(val).catch(function (err) {
    console.log("dropdown error");
  })
}

async function editMailNotification(toggle) {
  var currentSettings = true;
  await driver.findElement(By.xpath('//span[@id="notifications-global-off"]')).catch(function (err) {
    currentSettings = false;
  })
  console.log("mail notifications " + currentSettings + " : " + toggle);
  if ((currentSettings == true && toggle == false) || (currentSettings == false && toggle == true)) {
    if (currentSettings == true) {
      console.log("current : " + currentSettings);
      await driver.findElement(By.xpath('//span[@id="notifications-global-off"]')).click();
    } else {
      console.log("current : " + currentSettings);
      await driver.findElement(By.xpath('//span[@id="notifications-global-on"]')).click();
    }
  }

}




async function saveSettings(confirm) {
  // save settings
  await new Promise(resolve => setTimeout(resolve, 1500));
  await driver.findElement(By.xpath("//button[@id='settings_save']")).click();
  await new Promise(resolve => setTimeout(resolve, 500));

  if (confirm == true) {
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



// exports.login = function (user, pass) {
//   username = user;
//   password = pass;
//   main()
//     .then((result) => {
//       return true;
//     });
// }

// exports.privacy_setting = function (index) {
//   setting(index)
//     .then((result) => {
//       return true;
//     })
// }
