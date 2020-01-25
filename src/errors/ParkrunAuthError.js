const NetError = require("./ParkrunNetError");

class ParkrunAuthError extends NetError {
  constructor(message) {
    super();
    this.message = message;
    this.name = this.constructor.name;
  }
}

module.exports = ParkrunAuthError;
