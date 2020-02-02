const AuthError = require("./ParkrunAuthError");

/**
 * An error class for when a refresh token has expired.
 *
 * @extends {ParkrunAuthError}
 */
class ParkrunRefreshExpiredError extends AuthError {
  constructor(message) {
    super(message);
  }
}

module.exports = ParkrunRefreshExpiredError;
