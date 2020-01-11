const SeriesID = require("../common/SeriesID");

// We are requiring this so we get IntelliSense for end-users.
const EventNewsPost = require("./EventNewsPost");

/**
 *  A class representing a Parkrun event.
 *
 * @borrows Parkrun#getNews as getNews
 */
class Event {
  constructor(res) {
    this._id = Number.parseInt(res.EventNumber);
    this._name_internal = res.EventName;
    this._name_short = res.EventShortName;
    this._name = res.EventLongName;
    this._location = res.EventLocation;
    this._countryCode = Number.parseInt(res.CountryCode);
    this._preferredLanguage = res.PreferredLanguage;
    this._seriesID = Number.parseInt(res.SeriesID);
    // Skipping res.NextAnniversary as it seems to be broken. (returns 2017 in 2020.)
    this._isClientUserHomeRun = new Boolean(res.HomeRunSelection);
    this._isActive = new Boolean(res.StatusLive);
    // Skipping res.AnniversarySaturdayOfMonth as we can calculate that from the series ID.
    this._status = res.EventStatus;
    // Skipping res.UserFavourite for now, waiting on issue #4.
    this._officeEmail = res.EventOfficeEmail;
    this._helperEmail = res.EventHelpersEmail;
    this._totalEvents = Number.parseInt(res.TotalEventsStaged);
    this._public = new Boolean(res.AccessibleToPublic);
  }

  /**
   * Get all news posts for this event.
   *
   * @see Parkrun#getNews()
   *
   * @param {Number} eventID
   * @returns {Promise<Array<EventNewsPost>>} Array of news posts.
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
   */
  async getNews() {
    return core.getNews(this._id);
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
   * @example event.getInternalName(); // 'example-juniors'
   */
  getInternalName() {
    return this._name_internal;
  }

  /**
   * Get the short name for this event.
   *
   * @returns {String} Event short name.
   * @example event.getShortName(); // 'Example juniors'
   */
  getShortName() {
    return this._name_short;
  }

  /**
   * Get the name of this event.
   *
   * @returns {String}
   * @example event.getName(); // 'Example junior parkrun'
   */
  getName() {
    return this._name;
  }

  /**
   * Get the location of this event.
   *
   * @returns {String} Event location.
   * @example event.getLocation(); // 'Example Park'
   */
  getLocation() {
    return this._location;
  }

  /**
   * Get the Parkrun Country Code for this event.
   *
   * @returns {Number} Country Code.
   * @example event.getCountryCode(); // 97
   */
  getCountryCode() {
    return this._countryCode;
  }

  /**
   * Get the preferred language for this event.
   *
   * @returns {String} preferred language
   * @example event.getPreferredLangauge(); // 'en'
   */
  getPreferredLanguage() {
    return this._preferredLanguage;
  }

  /**
   * Get the Numerical Series ID for this event.
   *
   * @see getEventDay for this value as a string.
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
   * Boolean value representing weather this event is the client user's home run.
   *
   * @returns {Boolean} is client user's home run?
   */
  getIsClientUserHomerun() {
    return this._isClientUserHomeRun;
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
   * @returns {String} Office Email.
   */
  getOfficeEmail() {
    return this._officeEmail;
  }

  /**
   * Get the helper email for this event.
   *
   * @returns {String} Helper Email.
   */
  getHelperEmail() {
    return this._helperEmail;
  }

  /**
   * Get the amount of sessions that have taken place at this event.
   *
   * @returns {Number} No. of sessions taken place.
   */
  getTotalCount() {
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

module.exports = Event;
