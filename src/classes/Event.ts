import { ParkrunDataNotAvailableError } from "../errors";
import { Parkrun } from "./parkrun";
import { SeriesID } from "../common";

/**
 *  A class representing a Parkrun event.
 */
export class Event {
	private _id: number;
	private _name_internal: string;
	private _name_short: string;
	private _name: string;
	private _location: string;
	private _countryCode: number;
	private _preferredLanguage: string;
	private _seriesID: number;
	private _isActive: boolean;
	private _status: string;
	private _officeEmail: string;
	private _helperEmail: string;
	private _totalEvents: number;
	private _public: boolean;

	constructor(res, private readonly _core: Parkrun) {
		this._id = Number.parseInt(res.EventNumber);
		this._name_internal = res.EventName;
		this._name_short = res.EventShortName;
		this._name = res.EventLongName;
		this._location = res.EventLocation;
		this._countryCode = Number.parseInt(res.CountryCode);
		this._preferredLanguage = res.PreferredLanguage;
		this._seriesID = Number.parseInt(res.SeriesID);
		// Skipping res.NextAnniversary as it seems to be broken. (returns 2017 in 2020.)

		// After 08850d5, res.HomeRunSelection has been removed as it is not an accurate response.

		this._isActive = !!new Boolean(res.StatusLive);
		// Skipping res.AnniversarySaturdayOfMonth as we can calculate that from the series ID.
		this._status = res.EventStatus;
		// Skipping res.UserFavourite for now, waiting on issue #4. - note that seems to return null when using Athlete Events?

		this._officeEmail = res.EventOfficeEmail; // undefined handled in getter
		this._helperEmail = res.EventHelpersEmail; // undefined handled in getter
		this._totalEvents = Number.parseInt(res.TotalEventsStaged); // NaN handled in getter

		this._public = !!new Boolean(res.AccessibleToPublic);
	}

	/**
	 * Get all news posts for this event.
	 *
	 * @see (Borrows from {@link Parkrun.getNews})
	 *
	 * @returns {Promise<Array<EventNewsPost>>} Array of news posts.
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getNews() {
		return this._core.getNews(this._id);
	}

	/**
	 * Get the upcoming roster(s) for this event.
	 *
	 * @see (Borrows from {@link Parkrun.getRoster})
	 *
	 * @returns {Promise<Array<RosterVolunteer>>}
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getRoster() {
		return this._core.getRoster(this._id);
	}

	/**
	 * Get statistics across a parkrun event.
	 *
	 * @see (Borrows from {@link Parkrun.getStatsByEvent})
	 * @see {@link Parkrun.getStats}
	 *
	 * @returns {Promise<Object>} statistics.
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getStats() {
		return this._core.getStatsByEvent(this._id);
	}

	/**
	 * Get the Event ID of this event.
	 *
	 * @returns {Number} Event ID.
	 */
	getID() {
		return this._id;
	}

	// (URL slug)
	/**
	 * Get the internal name for this event, in a URL / URI friendly format.
	 *
	 * @returns {String} Internal name.
	 * @example ```ts
	 * event.getInternalName(); // 'example-juniors'
	 * ```
	 */
	getInternalName() {
		return this._name_internal;
	}

	/**
	 * Get the short name for this event.
	 *
	 * @returns {String} Event short name.
	 * @example ```ts
	 * event.getShortName(); // 'Example juniors'
	 * ```
	 */
	getShortName() {
		return this._name_short;
	}

	/**
	 * Get the name of this event.
	 *
	 * @returns {String}
	 * @example ```ts
	 * event.getName(); // 'Example junior parkrun'
	 * ```
	 */
	getName() {
		return this._name;
	}

	/**
	 * Get the location of this event.
	 *
	 * @returns {String} Event location.
	 * @example ```ts
	 * event.getLocation(); // 'Example Park'
	 * ```
	 */
	getLocation() {
		return this._location;
	}

	/**
	 * Get the Parkrun Country Code for this event.
	 *
	 * @returns {Number} Country Code.
	 * @example ```ts
	 * event.getCountryCode(); // 97
	 * ```
	 */
	getCountryCode() {
		return this._countryCode;
	}

	/**
	 * Get the preferred language for this event.
	 *
	 * @returns {String} preferred language
	 * @example ```ts
	 * event.getPreferredLangauge(); // 'en'
	 * ```
	 */
	getPreferredLanguage() {
		return this._preferredLanguage;
	}

	/**
	 * Get the Numerical Series ID for this event.
	 *
	 * @see {@link Event.getEventDay} for this value as a string.
	 * @returns {Number} Series ID.
	 */
	getSeriesID() {
		return this._seriesID;
	}

	/**
	 *  Get the day of the week that this event takes place.
	 *
	 * @returns {"Saturday" | "Sunday" | "Unknown"} String day.
	 */
	getEventDay() {
		return SeriesID.getDayOfWeek(this.getSeriesID());
	}

	/**
	 * Boolean showing weather this event is active or not.
	 *
	 * @returns {Boolean} is active?
	 */
	getIsActive() {
		return this._isActive;
	}

	/**
	 * Get the string status of this event.
	 *
	 * @returns {String} status.
	 */
	getStatus() {
		return this._status;
	}

	/**
	 * Get the office email for this event.
	 *
	 * Only available when this class is constructed via {@link Parkrun.getEvent}.
	 *
	 * @returns {String} Office Email.
	 * @throws {@link ParkrunDataNotAvailableError} When not using {@link Parkrun.getEvent}, this value is not provided and trying to access it will result in this error.
	 */
	getOfficeEmail() {
		if (this._officeEmail == undefined)
			throw new ParkrunDataNotAvailableError(
				"getOfficeEmail(). reason: only available when using getEvent()"
			);
		return this._officeEmail;
	}

	/**
	 * Get the helper email for this event.
	 *
	 * Only available when this class is constructed via {@link Parkrun.getEvent}.
	 *
	 * @returns {String} Helper Email.
	 * @throws {@link ParkrunDataNotAvailableError} When not using {@link Parkrun.getEvent}, this value is not provided and trying to access it will result in this error.
	 */
	getHelperEmail() {
		if (this._helperEmail == undefined)
			throw new ParkrunDataNotAvailableError(
				"getHelperEmail(). reason: only available when using getEvent()"
			);
		return this._helperEmail;
	}

	/**
	 * Get the amount of sessions that have taken place at this event.
	 *
	 * Only available when this class is constructed via {@link Parkrun.getEvent}.
	 *
	 * @returns {Number} No. of sessions taken place.
	 * @throws {@link ParkrunDataNotAvailableError} When not using {@link Parkrun.getEvent}, this value is not provided and trying to access it will result in this error.
	 */
	getTotalCount() {
		if (isNaN(this._totalEvents))
			throw new ParkrunDataNotAvailableError(
				"getTotalCount(). reason: only available when using getEvent()"
			);
		return this._totalEvents;
	}

	/**
	 * Boolean representing weather this event is public or not.
	 *
	 * @returns {Boolean} is public event?
	 */
	getIsPublic() {
		return this._public;
	}
}
