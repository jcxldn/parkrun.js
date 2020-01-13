const net = require("../classes/Net").getNonAuthed();

const TokensData = require("../classes/Tokens")._TokensData;

module.exports = async refreshToken => {
  const params = new URLSearchParams();
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");
  try {
    const res = await net.post("/auth/refresh", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    // Token refresh was successful, now we return a new Tokens class object.
    const output = res.data;
    output.refresh_token = refreshToken;
    return new TokensData(output, res.headers.date);
  } catch (err) {
    throw new Error("error during token refresh");
  }
};
