class FreedomRunResult {
  constructor(res) {
    this._time = res.RunTime;
    this._date = new Date(res.RunDate);
    this._athlete = res.AthleteID;
    this._event = res.EventNumber;

    // TODO: getEvent() object and then getEventName() async function

    // Core object is the Parkrun.JS core class.
    // Also note that there is no point in having a getAthlete() function as you can only use this with ClientUser anyway.
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
