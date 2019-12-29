const Validate = require("../validate");

const HomeRun = require("./HomeRun");

const AthleteExpandedSchema = require("../schemas/AthleteExpanded");

const capitalize = str =>
  str.toLowerCase().replace(/^\w/, c => c.toUpperCase());

/**
 * A class representing a Parkrun User.
 */
class User {
  /**
   * Create a new User class from the API responses.
   *
   * @param {*} res the API response
   * @returns {User} the new user class
   */
  constructor(res) {
    const data = Validate(res, AthleteExpandedSchema).value.data.Athletes[0];

    this._athleteID = data.AthleteID;
    this._avatar = data.Avatar;
    this._clubName = data.ClubName;
    this._firstName = data.FirstName;
    this._homeRun = new HomeRun(
      data.HomeRunID,
      data.HomeRunLocation,
      data.HomeRunName
    );
    this._lastName = data.LastName;
    this._sex = data.Sex;
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
   * @returns {String} gender
   */
  getSex() {
    return this._sex;
  }

  /**
   * Gets the user's full name.
   *
   * @returns {String} full name
   */
  getFullName() {
    return `${this.getFirstName()} ${this.getLastName()}`;
  }
}

module.exports = User;
