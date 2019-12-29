const Validate = require("../validate");

const HomeRun = require("./HomeRun");

const AthleteExpandedSchema = require("../schemas/AthleteExpanded");

const capitalize = str =>
  str.toLowerCase().replace(/^\w/, c => c.toUpperCase());

module.exports = class User {
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

  getID() {
    return this._athleteID;
  }

  getAvatar() {
    return this._avatar;
  }

  getClubName() {
    return this._clubName;
  }

  getFirstName() {
    return capitalize(this._firstName);
  }

  getHomeRun() {
    return this._homeRun;
  }

  getLastName() {
    return capitalize(this._lastName);
  }

  getSex() {
    return this._sex;
  }

  getFullName() {
    return `${this.getFirstName()} ${this.getLastName()}`;
  }
};
