// Represents the currently logged in user

const Validate = require("../validate");

const User = require("./User");

const ClientAthleteExpandedExtra = require("../schemas/ClientAthleteExpandedExtra");

const DataNotAvailableError = require("../errors/ParkrunDataNotAvailableError");

const FreedomRunResult = require("./FreedomRunResult");

/**
 * A class representing the currently-logged in user.
 *
 * @extends {User}
 */
class ClientUser extends User {
  constructor(res, authedNet, core) {
    const data = Validate(res, ClientAthleteExpandedExtra).data.Athletes[0];
    // Set the base objects
    super(res, authedNet);

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
    const res = await this._authedNet.get(`/v1/freedomruns`).catch(err => {
      throw new NetError(err);
    });

    const out = [];

    for (var i = 0, len = res.data.data.FreedomRuns.length; i < len; i++) {
      out.push(new FreedomRunResult(res.data.data.FreedomRuns[i], this._core));
    }

    return out;
  }

  /**
   * Get the user's gender.
   *
   * @returns {String} gender
   */
  getSex() {
    return this._sex;
  }
}

module.exports = ClientUser;
