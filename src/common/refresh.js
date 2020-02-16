const net = require("../classes/Net").getNonAuthed();

const TokensData = require("../classes/TokensData");

const SearchParams = require("./SearchParams");

const RefreshExpiredError = require("../errors/ParkrunRefreshExpiredError");
const AuthError = require("../errors/ParkrunAuthError");

module.exports = async refreshToken => {
  const params = new SearchParams([
    ["refresh_token", refreshToken],
    ["grant_type", "refresh_token"]
  ]);

  try {
    const res = await net.post("/auth/refresh", params.get(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    // Token refresh was successful, now we return a new Tokens class object.
    const output = res.data;
    output.refresh_token = refreshToken;
    return new TokensData(output, res.headers.date);
  } catch (err) {
    if (
      err.response.status == 400 &&
      err.response.data.error == "invalid_grant"
    ) {
      // At this point, we either have an expired or invalid refresh token.

      if (err.response.data.error_description == "Refresh token has expired") {
        throw new RefreshExpiredError("refresh token has expired");
      }

      if (err.response.data.error_description == "Invalid refresh token") {
        throw new AuthError("invalid refresh token");
      }

      throw new Error("server returned http code 400");
    }
    throw new Error("unspecified error during token refresh");
  }
};
