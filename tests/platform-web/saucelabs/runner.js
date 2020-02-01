const opts = require("./opts");

const { parallel } = require("async");

const runner = async () => {
  const browsers = await opts.getBrowsers();

  const out = [];

  browsers.forEach((value, index) => {
    out.push(function() {
      console.log(
        `Browser #${index} - ${value.browserName}@${value.version} under ${value.platform}`
      );
      const driver = opts.makeDriver(value);
      opts.run(driver);
    });
  });

  return out;
};

console.log("Waiting 30 seconds for the proxy to start...");

setTimeout(
  () =>
    runner().then(arr => {
      parallel(arr, () => console.log("done"));
    }),
  30000
);
