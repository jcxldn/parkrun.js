const URL = require("url-parse");

/**
 * Error class for Networking-related errors.
 *
 * @extends {Error}
 */
class ParkrunNetError extends Error {
  constructor(err) {
    if (err) {
      const message = `HTTP Error ${err.response.status} (${
        err.response.statusText
      }) on ${err.response.config.method
        .toString()
        .toUpperCase()} request to '${
        new URL(err.response.config.url).pathname
      }'`;

      super(message);
    } else {
      super();
    }

    this.name = this.constructor.name;
  }
}

module.exports = ParkrunNetError;
