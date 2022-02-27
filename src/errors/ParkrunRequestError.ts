import { AxiosError } from "axios";
import * as URL from "url-parse";

import { ParkrunNetError } from "./ParkrunNetError";

/**
 * Error class for request-related errors.
 *
 * @extends {Error}
 */
export class ParkrunRequestError extends ParkrunNetError {
	constructor(err: AxiosError) {
		// Construct a new error message based on response status, method and URI.
		const message = `HTTP Error ${err.response.status} (${
			err.response.statusText
		}) on ${err.response.config.method.toString().toUpperCase()} request to '${
			new URL(err.response.config.url).pathname
		}'`;

		// Call the parent constructor
		super(message);
	}
}
