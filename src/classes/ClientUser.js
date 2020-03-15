// Represents the currently logged in user

const Validate = require("../validate");

const User = require("./User");

const ClientAthleteExpandedExtra = require("../schemas/ClientAthleteExpandedExtra");

const DataNotAvailableError = require("../errors/ParkrunDataNotAvailableError");

const FreedomRunResult = require("./FreedomRunResult");

const SearchParams = require("../common/SearchParams");

/**
 * A class representing the currently-logged in user.
 *
 * @extends {User}
 */
class ClientUser extends User {
  constructor(res, core) {
    const data = Validate(res, ClientAthleteExpandedExtra).data.Athletes[0];
    // Set the base objects
    super(res, core);

    // Set the client-only objects
    this._clubID = Number.parseInt(data.ClubID);
    this._dob = new Date(data.DOB);
    this._mobileNumber = data.MobileNumber;
    this._base2_mail_ok = new Boolean(data.OKtoMail);
    this._postcode = data.Postcode;
    this._preSignupWeeklyExerciseFrequency = Number.parseInt(
      data.PreParkrunExerciseFrequency
    );
    this._base2_wheelchair = new Boolean(data.WheelchairAthlete);
    this._email = data.eMailID;

    this._sex = data.Sex;

    this._core = core;
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
   * @throws {ParkrunDataNotAvailableError} Error when no data is available, usually because of a new account with no runs.
   */
  getMobileNumber() {
    if (this._mobileNumber == null)
      throw new DataNotAvailableError(
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
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
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

  _hasNumOfDigits(numberOfDigits, number) {
    return number.toString().length == numberOfDigits;
  }

  /**
   * Create a new freedom run, given the event number, run year, month, day and time of completion.
   *
   * **Please note that Freedom Runs CANNOT be deleted.**
   *
   * @param {Number} eventNumber
   * @param {String} runYear The year of the run (4 digits)
   * @param {String} runMonth The month of the run. (2 digits)
   * @param {String} runDay The day of the run. (2 digits)
   * @param {String} runTime The time of the run (hh:mm:ss)
   *
   * @returns {Promise<Number>} The newly created Freedom Run ID.
   *
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
   * @throws {Error} Input data error.
   *
   * @example
   * const user = [...]
   *
   * await user.createFreedomRun(953, "2020", "02", "15", "00:15:45")
   * // example output - 166164059
   */
  async createFreedomRun(eventNumber, runYear, runMonth, runDay, runTime) {
    if (
      this._hasNumOfDigits(4, runYear) &&
      this._hasNumOfDigits(2, runMonth) &&
      this._hasNumOfDigits(2, runDay) &&
      runMonth <= 12 // haha works because quirky nodejs
    ) {
      const params = new SearchParams([
        ["AthleteID", this._athleteID],
        ["EventNumber", eventNumber],
        ["RunDate", runYear + runMonth + runDay],
        ["RunTime", runTime]
      ]);

      const res = await this._core
        ._getAuthedNet()
        .post("/v1/freedomruns", params.get(), {
          params: {
            expandedDetails: undefined,
            scope: "app"
          }
        })
        .catch(err => {
          throw new NetError(err);
        });

      return Number.parseInt(res.data.data.FreedomRuns.freedomID);
    } else {
      // unexpected lengths
      throw new Error("Invalid input!");
    }
  }
}

module.exports = ClientUser;
