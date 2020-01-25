const glob = require("glob");
const browserify = require("browserify");

const arr = glob.sync("./tests/*js");

console.log(arr);

const file = browserify(arr, {
  transform: [
    ["browserify-shim"],
    [
      "envify",
      {
        ID: process.env.ID,
        PASS: process.env.PASS
      }
    ]
  ]
});

const stream = require("fs").createWriteStream(
  "tests/platform-web/web-tests.tmp.js"
);

file.bundle().pipe(stream);

file.on("end", () => console.log("DONE"));
