/**
 * A class representing the Results of a Freedom Run.
 */
export class FreedomRunResult {
	private _id: number;
	private _time: string;
	private _date: Date;
	private _athlete: number;
	private _event: number;
	private _event_name: string;

	constructor(res: any, private readonly _core: any) {
		this._id = Number.parseInt(res.FreedomID);
		this._time = res.RunTime;
		this._date = new Date(res.RunDate);
		this._athlete = Number.parseInt(res.AthleteID);
		this._event = Number.parseInt(res.EventNumber);

		this._event_name = res.EventLongName;

		// Core object is the Parkrun.JS core class.
		// Also note that there is no point in having a getAthlete() function as you can only use this with ClientUser anyway.
	}

	/**
	 * Get the ID of this Freedom Run.
	 *
	 * @returns {Number} Freedom Run ID
	 */
	getID() {
		return this._id;
	}

	/**
	 * Get the event object for the event this took place at.
	 *
	 * @see (Borrows from {@link Parkrun.getEvent})
	 *
	 * @returns {Promise<Event>} Array of news posts.
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getEvent() {
		return this._core.getEvent(this.getEventID());
	}

	/**
	 *  Get the name of the event that this run took place at.
	 *
	 * @returns {String} Event name.
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	getEventName() {
		return this._event_name;
	}

	/**
	 * Get the finish time for this run.
	 *
	 * @returns {String} Finish time.
	 */
	getFinishTime() {
		return this._time;
	}

	/**
	 * Get the date of this run as a native Date object.
	 *
	 * @returns {Date} Date object.
	 */
	getRunDate() {
		return this._date;
	}

	/**
	 * Get the Athlete ID of the runner.
	 *
	 * @returns {Number} Athlete ID.
	 */
	getAthleteID() {
		return this._athlete;
	}

	/**
	 * Get the Event ID for this run's location.
	 *
	 * @returns {Number} Event ID.
	 */
	getEventID() {
		return this._event;
	}
}
