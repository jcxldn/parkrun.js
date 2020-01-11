const Constants = require("../constants");

/**
 * Error class for Networking-related errors.
 *
 * @extends {Error}
 */
class ParkrunNetError extends Error {
  constructor(err) {
    const message = `HTTP Error ${err.response.status} (${
      err.response.statusText
    }) on ${err.response.config.method.toString().toUpperCase()} request to '${
      err.response.config.url.toString().split(Constants.api_base)[1]
    }'`;

    super(message);

    this.name = this.constructor.name;
  }
}

module.exports = ParkrunNetError;
