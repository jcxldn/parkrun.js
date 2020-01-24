/**
 * Parkrun.JS Constants
 *
 * @static
 * @readonly
 */
module.exports = {
  api_base:
    process.env.PLATFORM !== "WEB"
      ? "https://api.parkrun.com"
      : "https://parkrun-proxy.x2.workers.dev/",
  auth_raw:
    "bmV0ZHJlYW1zLWlwaG9uZS1zMDE6Z2ZLYkRENk5Ka1lvRm1raXNSKGlWRm9wUUNLV3piUWVRZ1pBWlpLSw==",
  user_agent: "parkrun/1.2.7 CFNetwork/1121.2.2 Darwin/19.3.0"
};
