const glob = require("glob");

const classes = {};

const classArr = glob.sync("./src/classes/**/*js", {
  ignore: "./src/classes/parkrun.js"
});

const commonArr = glob.sync("./src/common/**/*js");
const errorsArr = glob.sync("./src/errors/**/*js");

const basePaths = [
  ["./", "../"],
  ["./src/", "../"],
  ["./src/", "./"]
];

basePaths.forEach(path => {
  classArr.forEach((v, i) => {
    classes[v.replace(path[0], path[1]).replace(".js", "")] = {
      exports: `global:Parkrun.ClassList.${v
        .split("/")
        .splice(-1)[0]
        .replace(".js", "")}`
    };
  });

  commonArr.forEach((v, i) => {
    classes[v.replace(path[0], path[1]).replace(".js", "")] = {
      exports: `global:Parkrun.ClassList._common.${v
        .split("/")
        .splice(-1)[0]
        .replace(".js", "")}`
    };
  });

  errorsArr.forEach((v, i) => {
    classes[v.replace(path[0], path[1]).replace(".js", "")] = {
      exports: `global:Parkrun.ClassList._errors.${v
        .split("/")
        .splice(-1)[0]
        .replace(".js", "")}`
    };
  });
});

module.exports = {
  ...classes,
  chai: { exports: "global:chai" },
  describe: { exports: "global:describe" },
  "../src/classes/parkrun": { exports: "global:Parkrun" }
};

console.log(
  `\nSource Files: ${classArr.length +
    commonArr.length +
    errorsArr.length}\nBase Paths: ${basePaths.length}\nTotal Rules: ${
    Object.keys(module.exports).length
  }`
);
