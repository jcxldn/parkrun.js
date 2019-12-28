const axios = require("axios").default;

const Parkrun = require("./classes/parkrun");
const Tokens = require("./classes/tokens");

const constants = require("./constants");

// Get the initial user/pass from the raw auth data
const authSplit = Buffer.from(constants.auth_raw, "base64")
  .toString("utf8")
  .split(":");

const a = axios.create({
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

module.exports = async (id, password) => {
  // ID checking here

  const params = new URLSearchParams();
  params.append("username", id);
  params.append("password", password);
  params.append("scope", "app");
  params.append("grant_type", "password");
  try {
    const res = await a.post("/user_auth.php", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    // Success, continue
    console.log(res.status);
    console.log(res.data);

    if (res.status == 200) {
      // Login successful, tokens recieved
      return new Parkrun(new Tokens(res.data, res.headers));
    }
  } catch (error) {
    if (error.response != undefined) {
      // A request was made and the server responsed with a non 2xx status code.
      if (error.response.status == 400) {
        throw new Error("invalid username or password!");
      }
    } else {
      throw new Error("unspecified error during auth flow");
    }
  }
};
