const net = require("../classes/Net").getNonAuthed();

const TokensData = require("../classes/TokensData");

const SearchParams = require("./SearchParams");

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
    throw new Error("error during token refresh");
  }
};
