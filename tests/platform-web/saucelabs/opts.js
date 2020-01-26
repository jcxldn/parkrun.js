const webdriver = require("selenium-webdriver");

const browsers = require("sauce-browsers");

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

const run = driver => {
  console.log("DRIVER RUNNING - ID "); //+ driver.builder.sessionID);
  //await driver.get("http://web_tests.nr.jcx.ovh:3000");

  return 0;
};

module.exports = {
  getBrowsers,
  makeDriver,
  run
};
