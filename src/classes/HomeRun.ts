/**
 * A class representing a user's Home Parkrun.
 */
export class HomeRun {
	private _id: number;

	constructor(id: string, private readonly _loc: any, private readonly _name: string) {
		this._id = Number.parseInt(id);
	}

	/**
	 * Get the Run ID for this run.
	 *
	 * @returns {Number} run ID
	 */
	getID() {
		return this._id;
	}

	/**
	 * Get the location for this run.
	 *
	 * @return {String} run location
	 */
	getLocation() {
		return this._loc;
	}

	/**
	 * Get the name of this run.
	 *
	 * @return {String} run name
	 */
	getName() {
		return this._name;
	}
}
