const ClientUser = require("./classes/ClientUser");
const Country = require("./classes/Country");
const Event = require("./classes/Event");
const EventNewsPost = require("./classes/EventNewsPost");
const FreedomRunResult = require("./classes/FreedomRunResult");
const HomeRun = require("./classes/HomeRun");
const RosterVolunteer = require("./classes/RosterVolunteer");
const RunResult = require("./classes/RunResult");
const User = require("./classes/User");

const AgeGradeEnums = require("./common/AgeGradeEnums");
const ClubsEnums = require("./common/ClubsEnums");
const refresh = require("./common/refresh");
const SearchParams = require("./common/SearchParams");
const SeriesID = require("./common/SeriesID");

const ParkrunAuthError = require("./errors/ParkrunAuthError");
const ParkrunDataNotAvailableError = require("./errors/ParkrunDataNotAvailableError");
const ParkrunNetError = require("./errors/ParkrunNetError");
const ParkrunRefreshExpiredError = require("./errors/ParkrunRefreshExpiredError");
const ParkrunUserPassError = require("./errors/ParkrunUserPassError");
const ParkrunValidationError = require("./errors/ParkrunValidationError");

module.exports = {
  ClientUser,
  Country,
  Event,
  EventNewsPost,
  FreedomRunResult,
  HomeRun,
  RosterVolunteer,
  RunResult,
  User,
  _common: {
    AgeGradeEnums,
    ClubsEnums,
    refresh,
    SearchParams,
    SeriesID
  },
  _errors: {
    ParkrunAuthError,
    ParkrunDataNotAvailableError,
    ParkrunNetError,
    ParkrunRefreshExpiredError,
    ParkrunUserPassError,
    ParkrunValidationError
  }
};
