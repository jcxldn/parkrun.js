// TODO: Rename to 'Client'

const Net = require("./Net");
const User = require("./User");
const ClientUser = require("./ClientUser");
const EventNewsPost = require("./EventNewsPost");

const NetError = require("../ParkrunNetError");

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

    this._net_authed = new Net(tokens.getCurrentAccessToken());
    this._net_params = this._net_authed._params;
  }

  /**
   * Get the authentication (login) and refresh tokens for this client instance.
   *
   * @returns {Tokens} Tokens instance.
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
  }

  _getAuthedNet() {
    return this._net_authed.getAuthed();
  }

  /**
   * Asynchronously get an athlete based on their ID.
   *
   * @param {Number} id athlete id of the user you wish to get.
   * @returns {Promise<User>} User object of the specified athlete.
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
   */
  async getAthlete(id) {
    const res = await this._getAuthedNet()
      .get(`/v1/athletes/${id}`, {
        params: { limit: 100, ...this._net_params }
      })
      .catch(err => {
        throw new NetError(err);
      });

    return new User(res.data, this._getAuthedNet());
  }

  /**
   * Get all news posts for the specified event id.
   *
   * @param {Number} eventID
   * @returns {Promise<Array<EventNewsPost>>} Array of news posts.
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
   */
  async getNews(eventID) {
    const res = await this._getAuthedNet()
      .get(`/v1/news/${eventID}`, {
        params: { offset: 0, ...this._net_params }
      })
      .catch(err => {
        throw new NetError(err);
      });

    const output = [];
    for (var i = 0, len = res.data.data.EventNews.length; i < len; i++) {
      output.push(new EventNewsPost(res.data.data.EventNews[i]));
    }

    return output;
  }

  /**
   * Get the Profile of the currently logged-in user.
   *
   * @returns {Promise<ClientUser>} Your ClientUser object.
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
   */
  async getMe() {
    const res = await this._getAuthedNet()
      .get("/v1/me")
      .catch(err => {
        throw new NetError(err);
      });

    return new ClientUser(res.data, this._getAuthedNet());
  }
}

module.exports = Parkrun;
