const opts = require("./opts");

const { parallel } = require("async");

const axios = require("axios").default;

const runner = async () => {
  const browsers = await opts.getBrowsers();

  const out = [];

  browsers.forEach((value, index) => {
    out.push(async function() {
      console.log(
        `Browser #${index} - ${value.browserName}@${value.version} under ${value.platform}`
      );
      const driver = opts.makeDriver(value);
      await opts.run(driver);
      console.log(`ARR DONE - ${index}`);
    });
  });

  return out;
};

console.log("Waiting 30 seconds for the proxy to start...");

setTimeout(
  () =>
    runner().then(arr => {
      parallel(arr, async () => {
        // All tests completed, cleanup time.

        // Use axios / saucelabs API to shutdown the SauceConnect proxy
        (
          await axios.get(
            `https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/tunnels`,
            {
              auth: {
                username: process.env.SAUCE_USERNAME,
                password: process.env.SAUCE_ACCESS_KEY
              }
            }
          )
        ).data.forEach(async tunnel => {
          console.log("Shutting down Tunnel: " + tunnel);
          await axios.delete(
            `https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/tunnels/${tunnel}`,
            {
              auth: {
                username: process.env.SAUCE_USERNAME,
                password: process.env.SAUCE_ACCESS_KEY
              }
            }
          );
        });
      });
    }),
  30000
);
