/**
 * Error when no data is available, usually because of a new account with no runs.
 *
 * @extends {Error}
 */
class ParkrunDataNotAvailableError extends Error {
  constructor(reqName) {
    const message = `no data available for ${reqName}`;

    super(message);

    this.name = this.constructor.name;
  }
}

module.exports = ParkrunDataNotAvailableError;
