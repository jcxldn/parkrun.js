module.exports = class Tokens {
  constructor(auth_res, headers) {
    this._access = auth_res.access_token;
    this._refresh = auth_res.refresh_token;
    this._type = auth_res.token_type;
    this._scope = auth_res.scope;

    // Setup variables to determine if the token is still valid
    console.log(headers.date);
    // Save the epoch of the start time
    this._date_start = new Date(headers.date).getTime() / 1000;
    console.log(this._date_start);
    this._date_end = parseInt(this._date_start) + parseInt(auth_res.expires_in);
    console.log(this._date_end);
  }

  isValid() {
    return new Date().getTime() / 1000 < this._date_end;
  }
};
