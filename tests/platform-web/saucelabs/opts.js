const webdriver = require("selenium-webdriver");

const browsers = require("sauce-browsers");

const Saucelabs = require("saucelabs");

//const saucelabs = new Saucelabs.default({
//  username: process.env.SAUCE_USERNAME,
//  password: process.env.SAUCE_ACCESS_KEY
//});

const constant_caps = Object.freeze({
  "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER,
  "sauce:options": {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    tags: ["parkrun.js"]
  }
});

const server_url = "https://ondemand.saucelabs.com/wd/hub";

const getBrowsers = async () => {
  return (
    await new browsers([
      { name: "android", version: ["oldest", "latest"] },
      { name: "chrome", version: ["oldest", "latest"] },
      { name: "firefox", version: ["oldest", "latest"] },
      { name: "internet explorer", version: "oldest..latest" },
      { name: "iphone", version: ["oldest", "latest"] },
      { name: "safari", version: "oldest..latest" },
      { name: "microsoftedge", version: "oldest..latest" }
    ])
  ).map(platform => {
    const ret = {
      browserName: platform.api_name,
      version: platform.short_version,
      platform: platform.os
    };

    if (ret.browserName === "android") ret.deviceName = platform.long_name;

    return ret;
  });
};

const makeDriver = _caps => {
  const caps = Object.assign({}, _caps, constant_caps);

  const driver = new webdriver.Builder()
    .withCapabilities(caps)
    .usingServer(server_url);

  //const builder = driver.build();

  //builder.getSession().then(function(sessionid) {
  //  builder.sessionID = sessionid.id_;
  //});

  return { driver, builder: null };
};

const run = ({ driver, builder }) => {
  console.log("DRIVER RUNNING - ID "); //+ builder.sessionID);

  /*
  await driver.get("http://web_tests.nr.jcx.ovh:3000");

  
  await builder.wait(
    new webdriver.WebElementCondition(
      "Wait for tests to finish",
      webdriver => webdriver.executeScript("window.TESTS_COMPLETE", "") == true
    )
  );

  const num_passed = Number.parseInt(await builder.executeScript("window.TESTS_PASSED", ""));
  const num_failed = Number.parseInt(await builder.executeScript("window.TESTS_FAILED", ""));

  postRun({ driver, builder, num_passed, num_failed });
  */
};

/*
const postRun = ({ driver, builder, num_passed, num_failed }) => {
  saucelabs.updateJob(
    builder.sessionID,
    { passed: true, "custom-data": { passed: num_passed, failed: num_failed } },
    null
  );
  driver.quit();
};*/
module.exports = {
  getBrowsers,
  makeDriver,
  run
};
