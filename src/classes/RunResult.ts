const { getDisplayName } = require("../common/AgeGradeEnums");

const SeriesID = require("../common/SeriesID");

/*

------------------------------
Removed details from response
------------------------------

Reason: Globally static

    - [data.Assisted] - Always null.
    - [data.OrgSubTypeID] - Always null.
    - [data.OrganisationID] - Always '1'.
    - [data.runnerSocial] - Always null.


Reason: Nonspecific to individual runs.

    - [data.ClubID] - External running club.
    - [data.ClubName] - See above.
    - [data.HomeRunName]
    - [data.JuniorClubMembership]
    - [data.JuniorRunTotal]
    - [data.RunTotal]
    - [data.parkrunClubMembership]
    - [data.volcount]

*/

/**
 * A class representing a Athlete's results from a particular run.
 */
class RunResult {
  constructor(data) {
    this._age_category = data.AgeCategory;
    this._age_grading = Number.parseFloat(data.AgeGrading);
    this._user_id = Number.parseInt(data.AthleteID);
    this._event_date = new Date(data.EventDate);
    this._event_name = data.EventLongName;
    this._event_number = Number.parseInt(data.EventNumber);
    this._finish_position = Number.parseInt(data.FinishPosition);
    this._user_first_name = data.FirstName;
    this._was_first_run_at_event = new Boolean(data.FirstTimer);
    this._gender_finish_position = Number.parseInt(data.GenderPosition);
    this._was_genuine_pb = new Boolean(data.GenuinePB);
    this._user_last_name = data.LastName;
    this._run_id = Number.parseInt(data.RunId);
    this._finish_time = data.RunTime;
    this._updated = new Date(data.Updated);
    this._was_pb = new Boolean(data.WasPbRun);
    this._series_id = Number.parseInt(data.SeriesID);

    this._age_grading_label = getDisplayName(this._age_grading);
  }

  /**
   * Get the athlete's age category at the time of this run.
   *
   * @returns {String} Age Category.
   */
  getAgeCategory() {
    return this._age_category;
  }

  /**
   * Get the *decimal* age grade for this run.
   *
   * @returns {Number} The decimal age grade as a float.
   */
  getAgeGradingDecimal() {
    return this._age_grading;
  }

  /**
   * Get the label for this run's age grade.
   *
   * @returns {String} Age Grade Label
   */
  getAgeGradingLabel() {
    return this._age_grading_label;
  }

  /**
   * Get the athlete's ID.
   *
   * @returns {Number} The Athlete's ID.
   */
  getAthleteId() {
    return this._user_id;
  }

  /**
   * Get the date that the run took place
   *
   * @returns {Date} Date object of when the run took place.
   */
  getEventDate() {
    return this._event_date;
  }

  /**
   * Get the name of the event that this run took place at.
   *
   * @returns {String} Event name.
   */
  getEventName() {
    return this._event_name;
  }

  /**
   * Get the ID of the event that the run took place at.
   *
   * @returns {Number} Event number.
   */
  getEventID() {
    return this._event_number;
  }

  /**
   * Get the athlete's finish position in the run.
   *
   * @returns {Number} Finish position.
   */
  getFinishPosition() {
    return this._finish_position;
  }

  /**
   * Get the athlete's first name.
   *
   * @returns {String} The athlete's first name.
   */
  getFirstName() {
    return this._user_first_name;
  }

  /**
   * Boolean of weather this was the athlete's first time at the event or not.
   *
   * @returns {Boolean} Was first run?
   */
  getWasFirstRunAtEvent() {
    return this._was_first_run_at_event;
  }

  /**
   * Get the athlete's finish position in the run, for their gender only.
   *
   * @returns {Number} Gender-specific finish position.
   */
  getGenderFinishPosition() {
    return this._gender_finish_position;
  }

  /**
   * Boolean on weather this run was a genuine pb or not.
   *
   * @returns {Boolean} Genuine PB?
   */
  getWasGenuinePB() {
    return this._was_genuine_pb;
  }

  /**
   * Get the athlete's last name.
   *
   * @returns {String} The athlete's last name.
   */
  getLastName() {
    // UPPERCASE response unlike User.js
    return this._user_last_name;
  }

  /**
   * Get the athlete's run number for this run.
   *
   * _(ex. This is Athlete #1234 25th run.)_
   *
   * @returns {Number} Run Number / ID.
   */
  getRunNumber() {
    return this._run_id;
  }

  /**
   * Get the athlete's finishing time for this run.
   *
   * @returns {String} finishing time.
   */
  getFinishTime() {
    return this._finish_time;
  }

  /**
   * Get the time this entry was last updated.
   *
   * @returns {Date} A Date object showing the timestamp for the last update.
   */
  getLastUpdated() {
    return this._updated;
  }

  /**
   * Get weather this run was a PB.
   *
   * @returns {Boolean} Was PB?
   * @see {@link RunResult#getWasGenuinePB} for a more accurate result.
   */
  getWasPB() {
    return this._was_pb;
  }

  /**
   * Get the numerical series ID for this run / event.
   *
   * @see {@link RunResult#getEventDay} for this value as a string.
   * @returns {Number} Series ID.
   */
  getSeriesID() {
    return this._series_id;
  }

  /**
   * Get the day of the week that this event takes place.
   *
   * @returns {"Saturday" | "Sunday" | "Unknown"} String day.
   */
  getEventDay() {
    return SeriesID.getDayOfWeek(this.getSeriesID());
  }
}

module.exports = RunResult;
