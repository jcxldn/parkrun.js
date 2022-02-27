/**
 * A class representing a volunteer's job during a parkrun event.
 */
class RosterVolunteer {
  constructor(res) {
    this._eventNumber = Number.parseInt(res.EventNumber);
    this._eventDate = new Date(res.eventdate);
    this._athleteID = Number.parseInt(res.athleteid);
    this._taskID = Number.parseInt(res.taskid);
    this._rosterID = Number.parseInt(res.rosterid);
    this._taskName = res.TaskName;
    this._athleteFirstName = res.FirstName;
    this._athleteLastName = res.LastName;
  }

  /**
   *  Get the event number for this roster.
   *
   * @returns {Number} Event Number.
   */
  getEventNumber() {
    return this._eventNumber;
  }

  /**
   *  Get the date that this job will take place at.
   *
   * @returns {Date} The event date as a native Date object.
   */
  getEventDate() {
    return this._eventDate;
  }

  /**
   *  Get the Athlete ID of the volunteer for this job.
   *
   * @returns {Number} Athlete ID.
   */
  getVolunteerID() {
    return this._athleteID;
  }

  /**
   * Get the task ID for this job. The lower the ID, the higher the importance.
   *
   * @returns {Number} Task ID.
   */
  getTaskID() {
    return this._taskID;
  }

  /**
   * Get the roster ID for this job.
   *
   * @returns {Number} Roster (job) ID.
   */
  getRosterID() {
    return this._rosterID;
  }

  /**
   * Get the task name for this job.
   *
   * @returns {String} Task Name.
   *
   * Example: 'Marshal', 'Finish Tokens', etc...
   */
  getTaskName() {
    return this._taskName;
  }

  /**
   * Get the first name of the volunteer performing this job.
   *
   * @returns {String} Volunteer's first name.
   */
  getVolunteerFirstName() {
    return this._athleteFirstName;
  }

  /**
   * Get the last name of the volunteer performing this job.
   *
   * @returns {String} Volunteer's last name.
   */
  getVolunteerLastName() {
    return this._athleteLastName;
  }
}

module.exports = RosterVolunteer;
