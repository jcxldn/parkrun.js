const TokensData = require("./TokensData");

const Refresh = require("../common/refresh");

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
   * @see {@link Tokens#getValidAccessToken} to get a valid access token.
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
   * When resolved, the new token (if needed) is also saved to {@link Tokens#getCurrentAccessToken}
   *
   * @returns {Promise<String>} A promise containing a valid access token.
   *
   * @throws {Error} General error during token refresh
   * @throws {ParkrunRefreshExpiredError} Error thrown when the current refresh token has expired for whatever reason.
   */
  async getValidAccessToken() {
    if (!this.isValid()) await this.getNewTokens();
    return this.getCurrentAccessToken();
  }

  // Use the refresh token to get a new access token
  /**
   * Get a new access token using the current refresh token.
   *
   * Upon fulfilment of this promise the new token will be accessed as before.
   *
   * @returns {Promise<void>}
   *
   * @throws {Error} General error during token refresh
   * @throws {ParkrunAuthError} Error thrown then the current refresh token is invalid.
   * @throws {ParkrunRefreshExpiredError} Error thrown when the current refresh token has expired for whatever reason.
   */
  async getNewTokens() {
    console.log("GET_NEW_TOKENS");
    const newData = await Refresh(this.getRefreshToken());
    this._data = newData;
  }
}

module.exports = Tokens;
