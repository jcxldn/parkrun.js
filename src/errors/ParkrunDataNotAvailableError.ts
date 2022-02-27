import { ParkrunNetError } from "./ParkrunNetError";

/**
 * Error when no data is available, usually because of a new account with no runs.
 *
 * @extends {ParkrunNetError}
 */
export class ParkrunDataNotAvailableError extends ParkrunNetError {
	constructor(reqName) {
		// Add a prefix to the supplied message
		const message = `no data available for ${reqName}`;
		// Call parent constructor
		super(message);
	}
}
