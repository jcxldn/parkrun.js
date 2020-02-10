const opts = require("./opts");

const { parallel } = require("async");

const axios = require("axios").default;

const serve = require("serve-handler");
const http = require("http");
const { createHttpTerminator } = require("http-terminator");

// Start the webserver
const server = http.createServer((req, res) => {
  return serve(req, res);
});

const serverTerm = createHttpTerminator({ server });

server.listen(3000, () => console.log("Webserver listening on *:3000."));

const runner = async () => {
  const browsers = opts.getBrowsers();

  const out = [];

  browsers.forEach((value, index) => {
    out.push(async function() {
      console.log(
        `Browser #${index} - ${value.browserName}@${value.browserVersion} under ${value.platformName}`
      );
      const driver = opts.makeDriver(value);
      await opts.run(driver);
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

        // Stop the webserver
        await serverTerm.terminate();
        console.log("Webserver terminated.");

        // Use axios / saucelabs API to shutdown the SauceConnect proxy

        // Get a list of all active tunnels
        const tunnelList = await axios.get(
          `https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/tunnels`,
          {
            auth: {
              username: process.env.SAUCE_USERNAME,
              password: process.env.SAUCE_ACCESS_KEY
            }
          }
        );

        tunnelList.data.forEach(async tunnelID => {
          // Get the details for the selected tunnel
          const tunnelDetails = await axios.get(
            `https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/tunnels/${tunnelID}`,
            {
              auth: {
                username: process.env.SAUCE_USERNAME,
                password: process.env.SAUCE_ACCESS_KEY
              }
            }
          );

          // If the tunnel identifier matches the env var, close it.
          if (
            tunnelDetails.data.tunnel_identifier ==
            process.env.TRAVIS_JOB_NUMBER
          ) {
            // Close the tunnel
            console.log(
              `Shutting down tunnel ${tunnelID} (for job ${tunnelDetails.data.tunnel_identifier})`
            );

            await axios.delete(
              `https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/tunnels/${tunnelID}`,
              {
                auth: {
                  username: process.env.SAUCE_USERNAME,
                  password: process.env.SAUCE_ACCESS_KEY
                }
              }
            );
          }
        });
      });
    }),
  30000
);
