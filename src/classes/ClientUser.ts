// Represents the currently logged in user

import { SearchParams } from "../common/SearchParams";
import { ParkrunDataNotAvailableError } from "../errors";
import { ParkrunNetError } from "../errors/ParkrunNetError";
import { ClientAthleteExpandedExtra } from "../schemas/ClientAthleteExpandedExtra";
import { validate } from "../validate";
import { FreedomRunResult } from "./FreedomRunResult";
import { Parkrun } from "./parkrun";
import { User } from "./User";

/**
 * A class representing the currently-logged in user.
 *
 * @extends {User}
 */
export class ClientUser extends User {
	private _clubID: number;
	private _dob: Date;
	private _mobileNumber: number;
	private _base2_mail_ok: boolean;
	private _preSignupWeeklyExerciseFrequency: number;
	private _postcode: string;
	private _base2_wheelchair: boolean;
	private _email: string;
	private _sex: string;

	constructor(res: any, _core: Parkrun) {
		const data = validate(res, ClientAthleteExpandedExtra).data.Athletes[0];
		// Set the base objects
		super(res, _core);

		// Set the client-only objects
		this._clubID = Number.parseInt(data.ClubID);
		this._dob = new Date(data.DOB);
		this._mobileNumber = data.MobileNumber;
		this._base2_mail_ok = !!new Boolean(data.OKtoMail);
		this._postcode = data.Postcode;
		this._preSignupWeeklyExerciseFrequency = Number.parseInt(data.PreParkrunExerciseFrequency);
		this._base2_wheelchair = !!new Boolean(data.WheelchairAthlete);
		this._email = data.eMailID;

		this._sex = data.Sex;
	}

	/**
	 * Gets the Club ID for the currently logged-in user.
	 * @returns {number} club id
	 */
	getClubID() {
		return this._clubID;
	}

	/**
	 * Gets the Date of Birth for the currently logged-in user.
	 *
	 * @returns {Date} date of birth
	 */
	getDOB() {
		return this._dob;
	}

	/**
	 * Gets the mobile number for the currently logged-in user.
	 *
	 * @returns {String} mobile number
	 * @throws {@link ParkrunDataNotAvailableError} Error when no data is available, usually because of a new account with no runs.
	 */
	getMobileNumber() {
		if (this._mobileNumber == null)
			throw new ParkrunDataNotAvailableError(
				`getMobileNumber, athlete ${this.getID()}, reason: mobile number not set`
			);
		return this._mobileNumber;
	}

	/**
	 * Gets the user's status towards extra communications.
	 *
	 * @returns {boolean} user's preference
	 */
	getCommunicationAllowed() {
		return this._base2_mail_ok;
	}

	/**
	 * Gets the post code of the currently-logged in user.
	 *
	 * @returns {string} post code
	 */
	getPostcode() {
		return this._postcode;
	}

	/**
	 * Gets the amount of times per week the user exercised before joining parkrun (survey data)
	 *
	 * @returns {number}
	 */
	getPreSignupExerciseFrequency() {
		return this._preSignupWeeklyExerciseFrequency;
	}

	/**
	 * Gets data on if the user is a wheelchair user
	 *
	 * @returns {boolean} user uses wheelchair?
	 */
	getIsWheelchairUser() {
		return this._base2_wheelchair;
	}

	/**
	 * Get's the user's email address.
	 *
	 * @returns {string} email address
	 */
	getEmail() {
		return this._email;
	}

	/**
	 * Get an array of all the user's freedom runs.
	 *
	 * @returns {Promise<Array<FreedomRunResult>>}
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 */
	async getFreedomRuns() {
		const res = await this._core._multiGet(
			"/v1/freedomruns",
			{},
			"FreedomRuns",
			"FreedomRunsRange"
		);

		return res.map(i => {
			return new FreedomRunResult(i, this._core);
		});
	}

	/**
	 * Get the user's gender.
	 *
	 * @returns {String} gender
	 */
	getSex() {
		return this._sex;
	}

	private _hasNumOfDigits(numberOfDigits: number, number: string) {
		return number.length == numberOfDigits;
	}

	/**
	 * Create a new freedom run, given the event number, run year, month, day and time of completion.
	 *
	 * **Please note that Freedom Runs CANNOT be deleted.**
	 *
	 * @param eventNumber
	 * @param runYear The year of the run (4 digits)
	 * @param runMonth The month of the run. (2 digits)
	 * @param runDay The day of the run. (2 digits)
	 * @param runTime The time of the run (hh:mm:ss)
	 *
	 * @returns {Promise<Number>} The newly created Freedom Run ID.
	 *
	 * @throws {@link ParkrunNetError} ParkrunJS Networking Error.
	 * @throws Error Input data error.
	 *
	 * @example ```ts
	 * const user = [...]
	 *
	 * await user.createFreedomRun(953, "2020", "02", "15", "00:15:45")
	 * // example output - 166164059
	 * ```
	 */
	async createFreedomRun(
		eventNumber: number,
		runYear: string,
		runMonth: string,
		runDay: string,
		runTime: string
	) {
		if (
			this._hasNumOfDigits(4, runYear) &&
			this._hasNumOfDigits(2, runMonth) &&
			this._hasNumOfDigits(2, runDay) &&
			parseInt(runMonth) <= 12 // not the best way to do this!
		) {
			const params = new SearchParams([
				["AthleteID", this.getID().toString()],
				["EventNumber", eventNumber.toString()],
				["RunDate", `${runYear}${runMonth}${runDay}`],
				["RunTime", runTime],
			]);

			const res = await this._core
				._getAuthedNet()
				.post("/v1/freedomruns", params.get(), {
					params: {
						expandedDetails: undefined,
						scope: "app",
					},
				})
				.catch(err => {
					throw new ParkrunNetError(err);
				});

			return Number.parseInt(res.data.data.FreedomRuns.freedomID);
		} else {
			// unexpected lengths
			throw new Error("Invalid input!");
		}
	}
}
