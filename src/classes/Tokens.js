const Refresh = require("../common/refresh");

class TokensData {
  constructor(auth_res, date_issued) {
    this._access = auth_res.access_token;
    this._refresh = auth_res.refresh_token;
    this._type = auth_res.token_type;
    this._scope = auth_res.scope;

    // Setup variables to determine if the token is still valid
    console.log("TOKENS");
    console.log(date_issued);
    // Save the epoch of the start time
    this._date_start = new Date(date_issued).getTime() / 1000;
    console.log(this._date_start);
    this._date_end = parseInt(this._date_start) + parseInt(auth_res.expires_in);
    console.log(this._date_end);
  }
}

/**
 * A class representing the client's authentication tokens.
 *
 * @class Tokens
 */
class Tokens {
  constructor(auth_res, date_issued) {
    console.log("TOKENA: " + date_issued);
    this._data = new TokensData(auth_res, date_issued);
  }

  /**
   * Boolean to check if the access token is valid.
   *
   * @returns {Boolean} is the token valid?
   */
  isValid() {
    return new Date().getTime() / 1000 < this._data._date_end;
  }

  /**
   * Gets the currently stored API Access Token.
   *
   * @returns {String} Access Token.
   */
  getCurrentAccessToken() {
    return this._data._access;
  }

  getRefreshToken() {
    return this._data._refresh;
  }

  getTokenType() {
    return this._data._type;
  }

  getScope() {
    return this._data._scope;
  }

  async getValidAccessToken() {
    if (!this.isValid()) await this.getNewTokens();
    return this.getCurrentAccessToken();
  }

  // Use the refresh token to get a new access token
  async getNewTokens() {
    console.log("GET_NEW_TOKENS");
    const newData = await Refresh(this.getRefreshToken());
    this._data = newData;
  }
}

Tokens._TokensData = TokensData;

module.exports = Tokens;
