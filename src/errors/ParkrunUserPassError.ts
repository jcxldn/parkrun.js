import { ParkrunAuthError } from "./ParkrunAuthError";

/**
 * An error class catching invalid usernames or passwords.
 *
 * @extends {ParkrunAuthError}
 */
export class ParkrunUserPassError extends ParkrunAuthError {
	constructor(message: string) {
		super(message);
	}
}
