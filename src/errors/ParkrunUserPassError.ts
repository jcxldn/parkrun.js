import AuthError from "./ParkrunAuthError"

/**
 * An error class catching invalid usernames or passwords.
 *
 * @extends {ParkrunAuthError}
 */
export default class ParkrunUserPassError extends AuthError {
  constructor(message) {
    super(message);
  }
}
