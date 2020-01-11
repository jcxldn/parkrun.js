/**
 * A class representing the Results of a Freedom Run.
 * 
 * @borrows Parkrun#getEvent as getEvent
 */
class FreedomRunResult {
  constructor(res, core) {
    this._time = res.RunTime;
    this._date = new Date(res.RunDate);
    this._athlete = res.AthleteID;
    this._event = res.EventNumber;

    this._core = core;

    // TODO: getEvent() object and then getEventName() async function

    // Core object is the Parkrun.JS core class.
    // Also note that there is no point in having a getAthlete() function as you can only use this with ClientUser anyway.
  }

  /**
   * Get the event object for the event this took place at.
   *
   * @see Parkrun#getEvent()
   *
   * @returns {Promise<Event>} Array of news posts.
   * @throws {ParkrunNetError} ParkrunJS Networking Error.
   */
  async getEvent() {
    return this._core.getEvent(this.getEventID())
  }

  async getEventName() {
    return (await this.getEvent()).getName()
  }

  getFinishTime() {
    return this._time;
  }

  getRunDate() {
    return this._date;
  }

  getAthleteID() {
    return this._athlete;
  }

  getEventID() {
    return this._event;
  }
}

module.exports = FreedomRunResult