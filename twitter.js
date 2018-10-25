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
  await driver.get('http://twitter.com/settings/safety');


  await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//input[@id="user_protected"]'), 1000)));
  await new Promise(resolve => setTimeout(resolve, 2000));

  // user protected
  const user_protected = driver.findElement(By.xpath('//input[@id="user_protected"]'));
  await user_protected.getAttribute('value').then(function(text){
    console.log("aa : " + text);
  })
  // await console.log("userprotected : " + user_protected.getAttribute('value'));
  if (user_protected.getAttribute('value') == 0) {
    await driver.findElement(By.xpath('//input[@id="user_protected"]')).click();
  }


  // save settings
  await new Promise(resolve => setTimeout(resolve, 500));
  await driver.findElement(By.xpath("//button[@id='settings_save']")).click();

  const auth_pass = await driver.findElement(By.xpath("//input[@id='auth_password']"));
  await auth_pass.sendKeys(password);
  // await new Promise(resolve => setTimeout(resolve, 500));
  await auth_pass.sendKeys(Key.ENTER);
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
