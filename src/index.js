const Parkrun = require("./classes/parkrun");
const auth = require("./auth");

/**
 * The Parkrun.js library main exports.
 */
module.exports = {
  Parkrun,
  AuthSync: auth
};
