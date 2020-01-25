const AuthError = require("./ParkrunAuthError");

class ParkrunUserPassError extends AuthError {
  constructor(message) {
    super(message);
  }
}

module.exports = ParkrunUserPassError;
