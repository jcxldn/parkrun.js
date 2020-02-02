const AuthError = require("./ParkrunAuthError");

/**
 * An error class catching invalid usernames or passwords.
 *
 * @extends {ParkrunAuthError}
 */
class ParkrunUserPassError extends AuthError {
  constructor(message) {
    super(message);
  }
}

module.exports = ParkrunUserPassError;
