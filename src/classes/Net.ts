import axios from "axios";

import constants from "../constants";

//const { version } = require("./parkrun") // doesn't work - possibly because of import loop?
const { version } = require("../../package.json");

// Get the initial user/pass from the raw auth data
const authSplit = constants.auth;

const opts = {
	baseURL: constants.api_base,
	auth: {
		username: authSplit[0],
		password: authSplit[1],
	},
	headers: {
		"X-Powered-By": `parkrun.js/${version} (https://parkrun.js.org/)`,
	},
};

// If available on the target platform, set the user agent
process.env.PLATFORM != "WEB" ? (opts.headers["User-Agent"] = constants.user_agent) : undefined;

export class Net {
	static getNonAuthed() {
		return axios.create(opts);
	}

	constructor(access_token) {
		const auth_opts = Object.assign(opts, {
			params: {
				expandedDetails: true,
				access_token,
				scope: "app",
			},
			auth: undefined,
		});
		this._params = auth_opts.params;
		this._axiosAuthed = axios.create(auth_opts);
		// https://github.com/axios/axios/issues/2190 (axios >=0.18.0)
		this._axiosAuthed.interceptors.request.use(config => {
			config.params = Object.assign(
				// Fix for leaking params when making multiple requests
				Object.assign({}, this._params),
				config.params
			);
			return config;
		});
	}

	getAuthed() {
		return this._axiosAuthed;
	}
}
