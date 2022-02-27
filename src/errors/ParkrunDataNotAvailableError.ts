import NetError from "./ParkrunNetError";

/**
 * Error when no data is available, usually because of a new account with no runs.
 *
 * @extends {ParkrunNetError}
 */
export default class ParkrunDataNotAvailableError extends NetError {
  constructor(reqName) {
    // Add a prefix to the supplied message
    const message = `no data available for ${reqName}`;
    // Call parent constructor
    super(message);
  }
}
