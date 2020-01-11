/**
 * A class representing a volunteer's job during a parkrun event.
 */
class RosterVolunteer {
  constructor(res) {
    this._eventNumber = Number.parseInt(res.EventNumber);
    this._eventDate = new Date(res.eventdate);
    this._athleteID = res.athleteid;
    this._taskID = res.taskid;
    this._rosterID = res.rosterid;
    this._taskName = res.TaskName;
    this._athleteFirstName = res.FirstName;
    this._athleteLastName = res.LastName;
  }
}

module.exports = RosterVolunteer;
