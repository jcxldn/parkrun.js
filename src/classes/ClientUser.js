// Represents the currently logged in user

const Validate = require("../validate");

const User = require("./User");

const ClientAthleteExpandedExtra = require("../schemas/ClientAthleteExpandedExtra");

const DataNotAvailableError = require("../errors/ParkrunDataNotAvailableError");

/**
 * A class representing the currently-logged in user.
 *
 * @extends {User}
 */
class ClientUser extends User {
  constructor(res, authedNet) {
    const data = Validate(res, ClientAthleteExpandedExtra).value.data
      .Athletes[0];
    // Set the base objects
    super(res, authedNet);

    // Set the client-only objects
    this._clubID = data.ClubID;
    this._dob = data.DOB;
    this._mobileNumber = data.MobileNumber;
    this._base2_mail_ok = data.OKtoMail;
    this._postcode = data.Postcode;
    this._preSignupWeeklyExerciseFrequency = data.PreParkrunExerciseFrequency;
    this._base2_wheelchair = data.WheelchairAthlete;
    this._email = data.eMailID;
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
    return Boolean(this._base2_mail_ok);
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
    return Boolean(this._base2_wheelchair);
  }

  /**
   * Get's the user's email address.
   *
   * @returns {string} email address
   */
  getEmail() {
    return this._email;
  }
}

module.exports = ClientUser;
