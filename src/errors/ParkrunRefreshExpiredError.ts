import { ParkrunAuthError } from "./ParkrunAuthError";

/**
 * An error class for when a refresh token has expired.
 *
 * @extends {ParkrunAuthError}
 */
export class ParkrunRefreshExpiredError extends ParkrunAuthError {
	constructor(message) {
		super(message);
	}
}
