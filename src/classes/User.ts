import { ParkrunDataNotAvailableError, ParkrunNetError } from "../errors";
import { AthleteExpandedSchema } from "../schemas/AthleteExpanded";
import { validate } from "../validate";
import { HomeRun, Parkrun, RunResult } from "./";
import { Club, ClubUtil, ClubType } from "../common";

const capitalize = str => str.toLowerCase().replace(/^\w/, c => c.toUpperCase());

/**
 * A class representing a Parkrun User.
 */
export class User {
	private _athleteID: number;
	private _avatar: string;
	private _clubName: string;
	private _firstName: string;
	private _homeRun: HomeRun;
	private _lastName: string;

	/**
	 * Create a new User class from the API responses.
	 *
	 * @param {*} res the API response
	 *
	 * @throws {@link ParkrunValidationError} ParkrunJS Validation Error - API response was not what was expected.
	 */
	constructor(res: any, protected readonly _core: Parkrun) {
		const data = validate(res, AthleteExpandedSchema).data.Athletes[0];

		this._athleteID = Number.parseInt(data.AthleteID);
		this._avatar = data.Avatar;
		this._clubName = data.ClubName;
		this._firstName = data.FirstName;
		this._homeRun = new HomeRun(data.HomeRunID, data.HomeRunLocation, data.HomeRunName);
		this._lastName = data.LastName;
	}

	/**
	 * Get the user's Athlete ID.
	 *
	 * @returns {Number}
	 */
	getID() {
		return this._athleteID;
	}

	/**
	 * Get the URL for the user's avatar.
	 *
	 * @returns {String} URL
	 */
	getAvatar() {
		return this._avatar;
	}

	/**
	 * Get the user's club name
	 *
	 * @returns {String} club name
	 */
	getClubName() {
		return this._clubName;
	}

	/**
	 * Get the user's first name
	 *
	 * @returns {String} first name
	 */
	getFirstName() {
		return capitalize(this._firstName);
	}

	/**
	 * Get the Home Run object for this user.
	 *
	 * @returns {HomeRun} HomeRun object
	 */
	getHomeRun() {
		return this._homeRun;
	}

	/**
	 * Get the user's last name
	 *
	 * @returns {String} last name
	 */
	getLastName() {
		return capitalize(this._lastName);
	}

	/**
	 * Get the user's gender.
	 *
	 * @deprecated As of #33 (Feb '20), this endpoint is no longer supported by Parkrun and will now result in an error.
	 * @throws {@link ParkrunDataNotAvailableError}
	 * @see https://github.com/Prouser123/parkrun.js/issues/33
	 */
	getSex() {
		throw new ParkrunDataNotAvailableError(
			"getSex() - removed upstream as of Febuary 2020, see issue #33."
		);
	}

	/**
	 * Gets the user's full name.
	 *
	 * @returns {String} full name
	 */
	getFullName() {
		return `${this.getFirstName()} ${this.getLastName()}`;
	}

	/**
	 * Get the user's run count.
	 *
	 * @returns {Promise<Number>} Run count.
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getRunCount() {
		/*
		 * We could use '/v1/hasrun/count/Run' or use '/v1/runs' (limit 1, offset 0).
		 *
		 * There is no visible benefit outside the margin of error at this time.
		 */
		const res = await this._core
			._getAuthedNet()
			.get("/v1/hasrun/count/Run", {
				params: { athleteId: this._athleteID, offset: 0 },
			})
			.catch(err => {
				throw new ParkrunNetError(err);
			});
		// If the user has no runs, this will return NaN, so in that case just return 0.
		return Number.parseInt(res.data.data.TotalRuns[0].RunTotal) || 0;
	}

	/**
	 * Get a array of the user's runs.
	 *
	 * @returns {Promise<Array<RunResult>>}
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getRuns() {
		const res = await this._core._multiGet(
			"/v1/results",
			{
				params: { athleteId: this._athleteID },
			},
			"Results",
			"ResultsRange"
		);

		return res.map(i => {
			return new RunResult(i);
		});
		// v2-e1f - [up to] 2x as fast as for loop for this kind of data.
	}

	/**
	 * Get the user's Parkrun Clubs (for milestone runs / duties)
	 *
	 * @see {User.getClubByType} if you want data from only a single club.
	 * @throws {ParkrunNetError} ParkrunJS Networking Error.
	 * @throws {ParkrunDataNotAvailableError} Error when no data is available, usually because of a new account with no runs.
	 *
	 * @example ```ts
	 *
	 * const user = .....
	 *
	 *
	 * await user.getClubs()
	 *
	 * // Example Response:
	 *
	 * [
	 *   { type: ClubType.ADULT, club: Clubs.TWO_HUNDRED_AND_FIFTY },
	 *   { type: ClubType.JUNIOR, club: Clubs.NONE },
	 *   { type: ClubType.VOLUNTEER, club: Clubs.TWENTY_FIVE }
	 * ]
	 * ```
	 */
	async getClubs() {
		// We are using /v1/results (from getRuns() as it returns all club statuses at once.)
		const res = await this._core
			._getAuthedNet()
			.get(`/v1/results`, {
				params: {
					athleteId: this._athleteID,
					limit: 1,
					offset: 0,
				},
			})
			.catch(err => {
				throw new ParkrunNetError(err);
			});
		const data = res.data.data.Results[0];
		if (data == undefined)
			throw new ParkrunDataNotAvailableError("getClubs, athlete " + this.getID());
		return ClubUtil.calculateFromParkrunResponse(data);
	}

	/**
	 * Get a club by it's type (defaults to {@link ClubType.ADULT})
	 * This default club represents club "milestones" for running a certain number of parkruns.
	 */
	async getClubByType(type: ClubType): Promise<Club> {
		const clubsData = await this.getClubs();
		return clubsData.find(dat => dat.type == type).club;
	}

	/**
	 * Get an array of {@link Event} objects for each parkrun that the athlete has run, in alphabetical order.
	 *
	 * @see (Borrows from {@link Parkrun.getAthleteParkruns})
	 *
	 * @returns {Promise<Array<Event>>}
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getEvents() {
		return this._core.getAthleteParkruns(this._athleteID);
	}
}
