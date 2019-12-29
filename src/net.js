const axios = require("axios");

const constants = require("./constants");
// Get the initial user/pass from the raw auth data
const authSplit = Buffer.from(constants.auth_raw, "base64")
  .toString("utf8")
  .split(":");

/**
 * The customised axios client to use for web requests.
 */
const net = axios.create({
  baseURL: constants.api_base,
  auth: {
    username: authSplit[0],
    password: authSplit[1]
  },
  headers: {
    "User-Agent": constants.user_agent,
    "X-Powered-By": "Parkrun.JS"
  }
});

module.exports = net;
