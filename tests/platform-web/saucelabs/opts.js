const webdriver = require("selenium-webdriver");

const browsers = require("sauce-browsers");

const constant_caps = Object.freeze({
  "sauce:options": {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    tags: ["parkrun.js"],
    "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER
  }
});

const server_url = "https://ondemand.eu-central-1.saucelabs.com/wd/hub";

const getBrowsers = async () => {
  return (
    await new browsers([
      //{ name: "android", version: ["oldest", "latest"] },
      { name: "chrome", version: ["oldest", "latest"] }
      //{ name: "firefox", version: ["oldest", "latest"] },
      //{ name: "internet explorer", version: "oldest..latest" },
      //{ name: "iphone", version: ["oldest", "latest"] },
      //{ name: "safari", version: "oldest..latest" },
      //{ name: "microsoftedge", version: "oldest..latest" }
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

  const builder = driver.build();

  //builder.getSession().then(function(sessionid) {
  //  builder.sessionID = sessionid.id_;
  //});

  return { driver, builder };
};

const run = async ({ driver, builder }) => {
  builder.sessionID = (await builder.getSession()).getId();

  console.log("DRIVER RUNNING - ID " + builder.sessionID);

  await new Promise(v => setTimeout(v, 5000));

  console.log("DONE");

  await builder.get("http://web_tests.nr.jcx.ovh:3000/tests/platform-web/web");

  await builder.wait(async webdriver => {
    console.debug("ELLO");
    let a = await webdriver.executeScript("return window.TESTS_COMPLETE");
    console.log(a);
    return a == true;
  });
  /*
  await builder.wait(
    new webdriver.WebElementCondition("Wait for tests to finish", webdriver => {
      return webdriver.executeScript("return window.TESTS_COMPLETE") == true;
    })
  );*/

  console.log("TDONE");

  await builder.takeScreenshot();

  const num_passed = Number.parseInt(
    await builder.executeScript("return window.TESTS_PASSED")
  );
  const num_failed = Number.parseInt(
    await builder.executeScript("return window.TESTS_FAILED")
  );

  /*await saucelabs.updateTest(
    builder.sessionID,
    JSON.stringify({
      passed: true,
      "custom-data": { passed: num_passed, failed: num_failed }
    })
  );*/

  const axios = require("axios").default;

  await axios.put(
    `https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/jobs/${builder.sessionID}`,
    {
      passed: true,
      "custom-data": { passed: num_passed, failed: num_failed }
    },
    {
      auth: {
        username: process.env.SAUCE_USERNAME,
        password: process.env.SAUCE_ACCESS_KEY
      }
    }
  );

  await builder.quit();
};

module.exports = {
  getBrowsers,
  makeDriver,
  run
};

console.log(getBrowsers().then(a => console.log(a)));
