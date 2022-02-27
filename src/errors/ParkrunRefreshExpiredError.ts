import AuthError from "./ParkrunAuthError"

/**
 * An error class for when a refresh token has expired.
 *
 * @extends {ParkrunAuthError}
 */
export default class ParkrunRefreshExpiredError extends AuthError {
  constructor(message) {
    super(message);
  }
}
