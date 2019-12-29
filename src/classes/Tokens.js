/**
 * A class representing the client's authentication tokens.
 *
 * @class Tokens
 */
class Tokens {
  constructor(auth_res, date_issued) {
    this._access = auth_res.access_token;
    this._refresh = auth_res.refresh_token;
    this._type = auth_res.token_type;
    this._scope = auth_res.scope;

    // Setup variables to determine if the token is still valid
    console.log(date_issued);
    // Save the epoch of the start time
    this._date_start = new Date(date_issued).getTime() / 1000;
    console.log(this._date_start);
    this._date_end = parseInt(this._date_start) + parseInt(auth_res.expires_in);
    console.log(this._date_end);
  }

  /**
   * Boolean to check if the access token is valid.
   *
   * @returns {Boolean} is the token valid?
   */
  isValid() {
    return new Date().getTime() / 1000 < this._date_end;
  }

  // TODO: Add getters
}

module.exports = Tokens;
