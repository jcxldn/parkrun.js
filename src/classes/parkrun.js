// TODO: Rename to 'Client'

const authSync = require("../auth");

// We are requiring this so we get IntelliSense for end-users.
const Tokens = require("./Tokens");

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
    return new Parkrun(await authSync(id, password));
  }

  // This TypeDef is for IntelliSense for end-users after using auth with callbacks.
  /**
   * @typedef {Function(Parkrun)} authCallback
   * @callback authCallback
   * @param {Parkrun} parkrun the Parkrun.JS client
   */

  /**
   * Synchronously authenticate a user via id/password
   *
   * @static
   * @param {String} id
   * @param {String} password
   * @param {authCallback} callback the callback to run once login has completed. The first paramater is the Parkrun client.
   * @example
   * const Parkrun = require("parkrun.js")
   * Parkrun.auth("A1234567", "password", function(client) => {
   *  // ...
   * })
   * @example
   * // Alternative example using ES6
   *
   * const Parkrun = require("parkrun.js")
   * Parkrun.auth("A1234567", "password", (client) => {
   *  // ...
   * })
   */
  static auth(id, password, callback) {
    //return new Parkrun(await authSync(id, password));
    authSync(id, password).then(tokens => {
      callback(new Parkrun(tokens));
    });
    //authSync(id, password).then(callback);
  }
}

module.exports = Parkrun;
