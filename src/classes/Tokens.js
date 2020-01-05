const Refresh = require("../common/refresh");

class TokensData {
  constructor(auth_res, date_issued) {
    this._access = auth_res.access_token;
    this._refresh = auth_res.refresh_token;
    this._type = auth_res.token_type;
    this._scope = auth_res.scope;

    // Setup variables to determine if the token is still valid

    // Save the epoch of the start time
    this._date_start = new Date(date_issued).getTime() / 1000;
    this._date_end = parseInt(this._date_start) + parseInt(auth_res.expires_in);
  }
}

/**
 * A class representing the client's authentication tokens.
 *
 * @class Tokens
 */
class Tokens {
  constructor(auth_res, date_issued) {
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
   * Gets the ___currently___ stored API Access Token.
   *
   * This function is __not recommended__ for use as the response may be invalid. No checks are peformed here.
   *
   * @see getValidAccessToken() to get a valid access token.
   *
   * @returns {String} Access token.
   */
  getCurrentAccessToken() {
    return this._data._access;
  }

  /**
   * Gets the currently stored API Refresh Token.
   *
   * The refresh token is used to retrieve new access tokens.
   *
   * @returns {String} Refresh token.
   */
  getRefreshToken() {
    return this._data._refresh;
  }

  /**
   * Gets the type of token in use.
   *
   * @returns {String} Token type.
   * @example
   * console.log(client.getTokens().getTokenType())
   * // - 'bearer'
   */
  getTokenType() {
    return this._data._type;
  }

  /**
   * Get the scope of the current access token being used.
   *
   * @returns {String} Token scope.
   * @example
   * console.log(client.getTokens().getScope())
   * // - 'app'
   */
  getScope() {
    return this._data._scope;
  }

  /**
   * Get a VALID API Access Token, issuing a new token if needed.
   *
   * @todo What *could* this throw?
   *
   * @returns {Promise<String>} A promise containing a valid access token.
   */
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
