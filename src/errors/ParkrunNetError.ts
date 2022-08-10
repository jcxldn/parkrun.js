import { AxiosError } from "axios";

export class ParkrunNetError extends Error {
	constructor(message: string, err?: AxiosError) {
		if (err) {
			const status: number = err.response.status;
			const statusText: string = err.response.statusText;
			const method: string = err.response.config.method.toString().toUpperCase();
			const path: string = new URL(err.response.config.url).pathname;
			message = `HTTP Error ${status} (${statusText}) on ${method} request to '${path}'`;
		}
		super(message);
	}
}
