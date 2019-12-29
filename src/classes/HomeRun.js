/**
 * A class representing a user's Home Parkrun.
 */
class HomeRun {
  constructor(id, loc, name) {
    this._id = Number.parseInt(id);
    this._loc = loc;
    this._name = name;
  }

  /**
   * Get the Run ID for this run.
   *
   * @returns {Number} run ID
   */
  getID() {
    return this._id;
  }

  /**
   * Get the location for this run.
   *
   * @return {String} run location
   */
  getLocation() {
    return this._loc;
  }

  /**
   * Get the name of this run.
   *
   * @return {String} run name
   */
  getName() {
    return this._name;
  }
}

module.exports = HomeRun;
