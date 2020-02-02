const NetError = require("./ParkrunNetError");

/**
 * A general error class for any authentication-related error.
 *
 * @extends {ParkrunNetError}
 */
class ParkrunAuthError extends NetError {
  constructor(message) {
    super();
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = ParkrunAuthError;
