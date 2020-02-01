const webdriver = require("selenium-webdriver");

const browsers = require("sauce-browsers");

const axios = require("axios").default;

const constant_caps = Object.freeze({
  "sauce:options": {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    tags: ["parkrun.js"],
    "tunnel-identifier": process.env.TRAVIS_JOB_NUMBER
  }
});

const server_url = "https://ondemand.eu-central-1.saucelabs.com/wd/hub";

const getBrowsers = () => {
  return [
    // ----- CHROME -----
    _makeBrowserItem(), // defaults
    //_makeBrowserItem(undefined, "27.0"),

    // ----- FIREFOX -----
    _makeBrowserItem("firefox"),
    //_makeBrowserItem("firefox", "15.0"),

    // ----- EDGE -----
    _makeBrowserItem("MicrosoftEdge"),
    _makeBrowserItem("MicrosoftEdge", "79.0") // Edge Chromium 1
    //_makeBrowserItem("MicrosoftEdge", "15.15063") // Edge Classic - Oldest Available

    // ----- IE ------
    //_makeBrowserItem("internet explorer")
  ];
};

const _makeBrowserItem = (browser, version, platform) => {
  return {
    browserName: browser || "chrome",
    browserVersion: version || "latest",
    platformName: platform || "Windows 10"
  };
};

const makeDriver = _caps => {
  const caps = Object.assign({}, _caps, constant_caps);

  const driver = new webdriver.Builder()
    .withCapabilities(caps)
    .usingServer(server_url);

  const builder = driver.build();

  return { driver, builder };
};

const run = async ({ driver, builder }) => {
  builder.sessionID = (await builder.getSession()).getId();

  console.log(`[${builder.sessionID}] Driver started.`);

  await builder.get("http://web_tests.nr.jcx.ovh:3000/tests/platform-web/web");

  await builder.wait(async webdriver => {
    return (
      (await webdriver.executeScript("return window.TESTS_COMPLETE")) == true
    );
  });

  console.log(`[${builder.sessionID}] Tests finished!`);

  // await builder.takeScreenshot()

  const num_passed = Number.parseInt(
    await builder.executeScript("return window.TESTS_PASSED")
  );
  const num_failed = Number.parseInt(
    await builder.executeScript("return window.TESTS_FAILED")
  );

  console.log(
    `[${builder.sessionID}] Passed: ${num_passed} || Failed: ${num_failed}`
  );

  await axios.put(
    `https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/jobs/${builder.sessionID}`,
    {
      passed: true,
      "custom-data": {
        passed: num_passed,
        failed: num_failed
      }
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

console.log(getBrowsers());
