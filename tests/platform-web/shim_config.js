const glob = require("glob");

const classes = {};

const classArr = glob.sync("./src/classes/**/*js", {
  ignore: "./src/classes/parkrun.js"
});

classArr.forEach((v, i) => {
  classes[v.replace("./", "../").replace(".js", "")] = {
    exports: `global:Parkrun.ClassList.${v
      .split("/")
      .splice(-1)[0]
      .replace(".js", "")}`
  };
});

module.exports = {
  ...classes,
  chai: { exports: "global:chai" },
  describe: { exports: "global:describe" },
  "../src/classes/parkrun": { exports: "global:Parkrun" }
};

console.log(module.exports);
