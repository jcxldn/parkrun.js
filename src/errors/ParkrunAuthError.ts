import NetError from "./ParkrunNetError";

/**
 * A general error class for any authentication-related error.
 *
 * @extends {ParkrunNetError}
 */
export default class ParkrunAuthError extends NetError {
  constructor(message) {
    super(message);
  }
}