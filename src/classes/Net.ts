import axios, { AxiosInstance } from "axios";

import { Constants } from "../constants";

//const { version } = require("./parkrun") // doesn't work - possibly because of import loop?
const { version } = require("../../package.json");

// Get the initial user/pass from the raw auth data
const authSplit = Constants.auth;

const opts = {
	baseURL: Constants.api_base,
	auth: {
		username: authSplit[0],
		password: authSplit[1],
	},
	headers: {
		"X-Powered-By": `parkrun.js/${version} (https://parkrun.js.org/)`,
	},
};

// If available on the target platform, set the user agent
process.env.PLATFORM != "WEB" ? (opts.headers["User-Agent"] = Constants.user_agent) : undefined;

export class Net {
	static getNonAuthed() {
		return axios.create(opts);
	}

	private _params: any;
	private _axiosAuthed: AxiosInstance;

	constructor(access_token: string) {
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
		//return this._axiosAuthed;
		// So that we can still override AxiosInstance params, we're going to use an intersection type
		type _AxiosInstance = AxiosInstance & { _params: object }
		return <_AxiosInstance>this._axiosAuthed;
	}

	getParams() {
		return this._params
	}
}
