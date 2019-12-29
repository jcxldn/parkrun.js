module.exports = class HomeRun {
  constructor(id, loc, name) {
    this._id = id;
    this._loc = loc;
    this._name = name;
  }

  getID() {
    return this._id;
  }

  getLocation() {
    return this._loc;
  }

  getName() {
    return this._name;
  }
};
