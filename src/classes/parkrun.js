// TODO: Rename to 'Client'

const authSync = require("../auth");

/**
 * The main hub for interacting with the Parkrun API.
 *
 * @module ParkrunJS
 */
class Parkrun {
  /**
   * Constructor from tokens.
   *
   * @param {Tokens} tokens
   */
  constructor(tokens) {
    this._tokens = tokens;
  }

  /**
   * Get the login and/or refresh tokens for this client instance.
   *
   * @returns {Tokens}
   */
  getTokens() {
    return this._tokens;
  }

  /**
   * Asynchronously authenticate a user via id/password
   *
   * @static
   * @param {String} id
   * @param {String} password
   * @returns {Promise<Parkrun>}
   * @example
   * const Parkrun = require("parkrun.js")
   * const client = await Parkrun.authSync("A1234567", "password")
   */
  static async authSync(id, password) {
    return authSync(id, password);
  }

  /**
   * Synchronously authenticate a user via id/password
   *
   * @static
   * @param {String} id
   * @param {String} password
   * @param {Function} callback the callback to run once login has completed.
   * @example
   * const Parkrun = require("parkrun.js")
   * Parkrun.auth("A1234567", "password", function(client) => {
   *  // ...
   * })
   */
  static auth(id, password, callback) {
    authSync(id, password).then(callback);
  }
}

module.exports = Parkrun;
