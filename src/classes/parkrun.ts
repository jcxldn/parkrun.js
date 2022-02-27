// TODO: Rename to 'Client'
import authSync from "../auth";
import ClassList from "../class_list";
import NetError from "../errors/ParkrunNetError";
import ClientUser from "./ClientUser";
import Country from "./Country";
import Event from "./Event";
import EventNewsPost from "./EventNewsPost";
import Net from "./Net";
import RosterVolunteer from "./RosterVolunteer";
import Tokens from "./Tokens";
import User from "./User";

// Import package.json for version and license static variables
const { version, license } = require("../../package.json");

/**
 * The main hub for interacting with the Parkrun API.
 */
export class Parkrun {
	/**
	 * Constructor from tokens.
	 *
	 * @param {Tokens} tokens
	 */
	constructor(tokens) {
		this._tokens = tokens;
	}

	/**
	 * Get the authentication (login) and refresh tokens for this client instance.
	 *
	 * @returns {Tokens} Tokens instance.
	 */
	getTokens() {
		return this._tokens;
	}

	/**
	 * Asynchronously authenticate a user via id/password
	 *
	 * @throws {ParkrunAuthError} (Unexpected) error during authentication flow.
	 * @throws {ParkrunUserPassError} Error thrown when the username or password is incorrect.
	 *
	 * @static
	 * @param {String} id
	 * @param {String} password
	 * @returns {Promise<Parkrun>}
	 * @example
	 * const Parkrun = require("parkrun.js")
	 * const client = await Parkrun.authSync("A1234567", "password")
	 */
	static async authSync(id, password) {
		return new Parkrun(await authSync(id, password));
	}

	// This TypeDef is for IntelliSense for end-users after using auth with callbacks.
	/**
	 * @typedef {Function(Parkrun)} authCallback
	 * @callback authCallback
	 * @param {Parkrun} parkrun the Parkrun.JS client
	 */

	/**
	 * Synchronously authenticate a user via id/password
	 *
	 * @throws {ParkrunAuthError} (Unexpected) error during authentication flow.
	 * @throws {ParkrunUserPassError} Error thrown when the username or password is incorrect.
	 *
	 * @static
	 * @param {String} id
	 * @param {String} password
	 * @param {authCallback} callback the callback to run once login has completed. The first paramater is the Parkrun client.
	 * @example
	 * const Parkrun = require("parkrun.js")
	 * Parkrun.auth("A1234567", "password", function(client, err) {
	 *  if (!err) {
	 *    // no errors, continue
	 *  }
	 * })
	 * @example
	 * // Alternative example using ES6
	 *
	 * const Parkrun = require("parkrun.js")
	 * Parkrun.auth("A1234567", "password", (client, err) => {
	 *  if (!err) {
	 *    // no errors, continue
	 *  }
	 * })
	 */
	static auth(id, password, callback) {
		//return new Parkrun(await authSync(id, password));
		authSync(id, password)
			.then((tokens) => callback(new Parkrun(tokens)))
			.catch((err) => callback(undefined, err));
	}

	/**
	 * Recreate a client based on previous authentication details.
	 *
	 * Please note that **no authentication** checks are handled here.
	 *
	 * @see {@link Parkrun.authRefresh} instead for an actual authentication method.
	 *
	 * @deprecated This method was meant for legacy users, and has a better alternative available. However, it will be included for the forseeable future.
	 *
	 * @static
	 * @param {Object} data
	 * @param {String} data.access access token
	 * @param {String} data.refresh refresh token
	 * @param {Number} data.access_expiry_date access token expiry date (as epoch)
	 * @param {String} [data.type=bearer] OPTIONAL - token type, usually 'bearer'
	 * @param {String} [data.scope=app] OPTIONAL - token scope, usally 'app'
	 * @returns {Parkrun}
	 */
	static recreateTokens({
		access,
		refresh,
		access_expiry_date,
		type = "bearer",
		scope = "app",
	}) {
		const tokens = new Tokens(
			{
				access_token: access,
				refresh_token: refresh,
				token_type: type,
				scope,
			},
			0
		);

		tokens._data._date_end = access_expiry_date;

		return new Parkrun(tokens);
	}

	/**
	 * (Asynchronously) Authenticate a client based on a previous refresh token.
	 *
	 * @throws {ParkrunAuthError} Error thrown if the refresh token is invalid.
	 * @throws {ParkrunRefreshExpiredError} Error thrown if the refresh token has expired.
	 * @throws {Error} General authentication flow error.
	 *
	 * @static
	 * @param {Object} data
	 * @param {String} data.refresh refresh token
	 * @param {String} [data.type=bearer] OPTIONAL - token type, usually 'bearer'
	 * @param {String} [data.scope=app] OPTIONAL - token scope, usally 'app'
	 *
	 * @returns {Promise<Parkrun>}
	 */
	static async authRefresh({ token, type = "bearer", scope = "app" }) {
		const tokens = new Tokens({
			refresh_token: token,
			token_type: type,
			scope,
		});

		// use this method to test the validity of the refresh token provided.
		// it will automatically reject if needed.
		await tokens.getValidAccessToken();

		return new Parkrun(tokens);
	}

	_getAuthedNet() {
		// Create the Parkrun Net class instance.
		// We do this every call in case the token has been renewed since the program's init. (this will happen with getNewTokens())
		const net = new Net(this._tokens.getCurrentAccessToken());

		// Get the Axios [Static] instance from the Net class.
		const authed = net.getAuthed();

		// Add ._params object to the axios class from the net class.
		authed._params = net._params;

		// Return the newly-customized Axios [Static] instance.
		return authed;
	}

	/**
	 * Asynchronously get an athlete based on their ID.
	 *
	 * @param {Number} id athlete id of the user you wish to get.
	 * @returns {Promise<User>} User object of the specified athlete.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 * @throws {ParkrunValidationError} ParkrunJS Validation Error - API response was not what was expected.
	 */
	async getAthlete(id) {
		const net = this._getAuthedNet();
		const res = await net
			.get(`/v1/athletes/${id}`, {
				params: { limit: 100, ...net._params },
			})
			.catch((err) => {
				throw new NetError(err);
			});

		return new User(res.data, this);
	}

	/**
	 * Get all news posts for the specified event id.
	 *
	 * @param {Number} eventID
	 * @returns {Promise<Array<EventNewsPost>>} Array of news posts.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getNews(eventID) {
		const net = this._getAuthedNet();
		const res = await net
			.get(`/v1/news/${eventID}`, {
				params: { offset: 0, ...net._params },
			})
			.catch((err) => {
				throw new NetError(err);
			});

		const output = [];
		for (var i = 0, len = res.data.data.EventNews.length; i < len; i++) {
			output.push(new EventNewsPost(res.data.data.EventNews[i]));
		}

		return output;
	}

	/**
	 * Get the Profile of the currently logged-in user.
	 *
	 * @returns {Promise<ClientUser>} Your ClientUser object.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 * @throws {ParkrunValidationError} ParkrunJS Validation Error - API response was not what was expected.
	 */
	async getMe() {
		const res = await this._getAuthedNet()
			.get("/v1/me")
			.catch((err) => {
				throw new NetError(err);
			});

		return new ClientUser(res.data, this);
	}

	/**
	 * Get the upcoming roster(s) for a parkrun event.
	 *
	 * @param {Number} eventID
	 * @returns {Promise<Array<RosterVolunteer>>}
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getRoster(eventID) {
		const res = await this._getAuthedNet()
			.get(`/v1/events/${eventID}/rosters`)
			.catch((err) => {
				throw new NetError(err);
			});

		const output = [];

		for (var i = 0, len = res.data.data.Rosters.length; i < len; i++) {
			output.push(new RosterVolunteer(res.data.data.Rosters[i]));
		}

		return output;
	}

	/**
	 * Asynchronously get an event based on its ID.
	 *
	 * @param {Number} id
	 * @returns {Promise<Event>} Event Object.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getEvent(id) {
		const res = await this._getAuthedNet()
			.get(`/v1/events/${id}`)
			.catch((err) => {
				throw new NetError(err);
			});

		return new Event(res.data.data.Events[0], this);
	}

	/**
	 * Get statistics across all of parkrun.
	 *
	 * @see Parkrun#getStatsByCountry
	 * @see Parkrun#getStatsByEvent
	 *
	 * @returns {Promise<Object>} statistics.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getStats() {
		const res = await this._getAuthedNet()
			.get("/v1/statistics")
			.catch((err) => {
				throw new NetError(err);
			});

		return this._makeStatsResponse(res);
	}

	/**
	 * Get statistics across a country.
	 *
	 * @see Parkrun#getStats
	 * @param {Number} id Country ID.
	 * @returns {Promise<Object>} statistics.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getStatsByCountry(id) {
		const res = await this._getAuthedNet()
			.get(`/v1/countries/${id}/statistics`)
			.catch((err) => {
				throw new NetError(err);
			});

		return this._makeStatsResponse(res);
	}

	/**
	 * Get statistics across a parkrun event.
	 *
	 * @see Parkrun#getStats
	 * @param {Number} id Event ID.
	 * @returns {Promise<Object>} statistics.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getStatsByEvent(id) {
		const res = await this._getAuthedNet()
			.get(`/v1/events/${id}/statistics`)
			.catch((err) => {
				throw new NetError(err);
			});

		return this._makeStatsResponse(res);
	}

	/**
	 * Internal function for creating Objects from the array of the statistics API endpoint.
	 *
	 * @see Parkrun#getStats
	 * @ignore
	 */
	_makeStatsResponse(res) {
		// getStatsByEvent does not return this statistic type
		if (res.data.data["Statistics-eventsThisWeek"] == null)
			res.data.data["Statistics-eventsThisWeek"] = [];

		// Official channels use the first of the three stat results
		return {
			...res.data.data["Statistics-TotalEvents"][0],
			...res.data.data["Statistics-Runners"][0],
			...res.data.data["Statistics-Averages"][0],
			...res.data.data["Statistics-Clubs"][0],
			...res.data.data["Statistics-Groups"][0],
			...res.data.data["Statistics-TotalRunTime"][0],
			...res.data.data["Statistics-Volunteers"][0],
			...res.data.data["Statistics-eventsThisWeek"][0],
		};
	}

	/**
	 *  Get an array of all active parkrun countries.
	 *
	 * @returns {Promise<Array<Country>>}
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getActiveCountries() {
		const res = await this._getAuthedNet()
			.get(`/v1/countries`)
			.catch((err) => {
				throw new NetError(err);
			});

		const output = [];

		for (var i = 0, len = res.data.data.Countries.length; i < len; i++) {
			output.push(new Country(res.data.data.Countries[i], this));
		}

		return output;
	}

	/**
	 * Get an array of all events for a country.
	 *
	 * @param {Number} countryID Country ID.
	 * @returns {Promise<Array<Event>>}
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getAllEventsByCountry(countryID) {
		const res = await this._multiGetEventsRaw({
			url: `/v1/countries/${countryID}/searchEvents`,
		});

		return res.map((i) => {
			return new Event(i);
		});
	}

	/**
	 * Get an array of all parkrun events.
	 *
	 * @returns {Promise<Array<Event>>}
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getAllEvents() {
		const res = await this._multiGetEventsRaw({ url: "/v1/searchEvents" });

		return res.map((i) => {
			return new Event(i);
		});
	}

	/**
	 * Get an array with the names of all parkrun events, in alphabetical order.
	 *
	 * @returns {Promise<Array<String>>}
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getAllEventNames() {
		const res = await this._multiGetEventsRaw({ url: "/v1/searchEvents" });

		return res.map((i) => {
			return i.EventLongName;
		});
	}
	/**
	 * Get an array with the names of all parkrun events in the specified country, in alphabetical order.
	 *
	 * @param {Number} countryID Country ID.
	 * @returns {Promise<Array<String>>}
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getAllEventNamesByCountry(countryID) {
		const res = await this._multiGetEventsRaw({
			url: `/v1/countries/${countryID}/searchEvents`,
		});

		return res.map((i) => {
			return i.EventLongName;
		});
	}

	/**
	 * Get an array of {@link Event} objects for each parkrun that the specified athlete has run, in alphabetical order.
	 *
	 * (Needed for freedomRuns)
	 *
	 * @param {Number} athleteID The athlete ID for which to get results for.
	 * @returns {Promise<Array<Event>>}
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getAthleteParkruns(athleteID) {
		const res = await this._multiGetEventsRaw({
			params: { athleteID, expandedDetails: false },
		});

		return res
			.map((i) => {
				return new Event(i);
			})
			.sort((a, b) => a.getName().localeCompare(b.getName()));
	}

	async _multiGet(url, options, dataName, rangeName) {
		// Create an array for the responses
		let data = [];

		/*
      Create the first request.
      We enforce a limit of 0 to lower request time.
      From this request we now know the total amount of runs.
    */
		const firstRequest = await this._makeMultiGetRequest(
			url,
			Object.assign({ params: { offset: 0, limit: 0 } }, options)
		);

		// Save the range object to a variable
		let range = firstRequest.range[rangeName][0];

		// Set the response array - this is the first request; no need to concat.
		data = firstRequest.data[dataName];

		console.log(range);
		console.log("FIRST REQUEST DONE");

		let amountDownloaded = Number.parseInt(range.last);
		const amountTotal = Number.parseInt(range.max);
		const amountRemaining = Number.parseInt(amountTotal - amountDownloaded);

		const amountOfPullsRequired = Math.ceil(amountRemaining / 100);

		console.log("Pulls Required: " + amountOfPullsRequired);

		const parallelRequests = [];

		for (let i = 1; i <= amountOfPullsRequired; i++) {
			console.log(`Step #${i} - Offset: ${amountDownloaded} (limit 100)`);

			parallelRequests.push(
				this._makeMultiGetRequest(
					url,
					Object.assign(
						{ params: { offset: amountDownloaded } },
						options
					)
				)
			);

			amountDownloaded += 100;
		}

		// Run them in promise.all
		const responsesArr = await Promise.all(parallelRequests);

		responsesArr.forEach((response) => {
			console.log(response.range[rangeName][0]);
			data = data.concat(response.data[dataName]);
		});

		console.log("[parkrun._multiGet] found " + data.length + " items.");

		// We now return the FULL array.
		return data;
	}

	async _makeMultiGetRequest(url, options) {
		const res = await this._getAuthedNet()
			.get(url, options)
			.catch((err) => {
				console.log(err);
				throw new NetError(err);
			});

		return { data: res.data.data, range: res.data["Content-Range"] };
	}

	async _multiGetEventsRaw({
		url = "/v1/events",
		params = { expandedDetails: true },
	}) {
		return await this._multiGet(
			url,
			{
				params,
			},
			"Events",
			"EventsRange"
		);
	}
}

// /**
//  * The Parkrun.JS version.
//  *
//  * @returns {String} Package version.
//  */
// Parkrun.version = version;

// /**
//  * The Parkrun.JS license, as stated by NPM.
//  *
//  * @returns {String} License type.
//  */
// Parkrun.license = license;

// Parkrun.ClassList = ClassList;
