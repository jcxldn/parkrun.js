const AuthError = require("./ParkrunAuthError");

class ParkrunExpiredRefreshError extends AuthError {
  constructor(message) {
    super(message);
  }
}

module.exports = ParkrunExpiredRefreshError;
