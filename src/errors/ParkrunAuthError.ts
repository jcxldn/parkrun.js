import { ParkrunNetError } from "./ParkrunNetError";

/**
 * A general error class for any authentication-related error.
 *
 * @extends {ParkrunNetError}
 */
export class ParkrunAuthError extends ParkrunNetError {
	constructor(message: string) {
		super(message);
	}
}
