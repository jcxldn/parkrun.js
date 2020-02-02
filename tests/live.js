const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");

const RunResult = require("../src/classes/RunResult");
const FreedomRunResult = require("../src/classes/FreedomRunResult");
const Country = require("../src/classes/Country");
const Event = require("../src/classes/Event");

const DataNotAvailableError = require("../src/errors/ParkrunDataNotAvailableError");

const SeriesDayAssert = data => {
  return chai.assert(["Saturday", "Sunday", "Unknown"].includes(data));
};

chai.should();
describe("Live", () => {
  let client = null;
  before(async () => {
    client = await Parkrun.authSync(process.env.ID, process.env.PASS);
    const me = await client.getMe();

    console.log(`Logged in as '${me.getFullName()}' (ID ${me.getID()})`);
  });

  describe("Tokens", () => {
    it("Current Access Token", done => {
      const token = client.getTokens().getCurrentAccessToken();
      chai.expect(token).to.be.a("string");
      done();
    });

    it("Refresh Token", done => {
      const token = client.getTokens().getRefreshToken();
      chai.expect(token).to.be.a("string");
      done();
    });

    it("Scope", done => {
      const scope = client.getTokens().getScope();
      chai.expect(scope).to.be.a("string");
      chai.expect(scope).to.eql("app");
      done();
    });

    it("Token Type", done => {
      const type = client.getTokens().getTokenType();
      chai.expect(type).to.be.a("string");
      chai.expect(type).to.eql("bearer");
      done();
    });

    it("Boolean Is Valid", done => {
      const bool = client.getTokens().isValid();
      chai.expect(bool).to.be.a("boolean");
      chai.expect(bool).to.eql(true);
      done();
    });

    it("Getter for any valid access token (.then)", done => {
      client
        .getTokens()
        .getValidAccessToken()
        .then(token => {
          chai.expect(token).to.be.a("string");
          done();
        })
        .catch(err => done(err));
    });

    it("Getter for a new access token", async () => {
      await client.getTokens().getNewTokens();
    });
  });

  describe("Athlete", () => {
    athlete = null;
    before("getAthlete (by id, .then)", async () => {
      athlete = await client.getAthlete(198825);
    });

    it("getID()", done => {
      id = athlete.getID();
      chai.expect(id).to.be.a("number");
      // We start counting from 0
      chai.expect(id.toString().length).to.eql(6);
      done();
    });

    it("getAvatar()", done => {
      data = athlete.getAvatar();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getClubName()", done => {
      data = athlete.getClubName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getFirstName()", done => {
      data = athlete.getFirstName();
      chai.expect(data).to.be.a("string");
      done();
    });

    describe("HomeRun", () => {
      homerun = null;
      before("getHomeRun()", done => {
        homerun = athlete.getHomeRun();
        done();
      });

      it("getID()", done => {
        data = homerun.getID();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getLocation()", done => {
        data = homerun.getLocation();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getName()", done => {
        data = homerun.getName();
        chai.expect(data).to.be.a("string");
        done();
      });
    });

    it("getLastName()", done => {
      data = athlete.getLastName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getSex() [DEPRECATED FUNCTION]", done => {
      try {
        data = athlete.getSex();
      } catch (err) {
        chai
          .expect(err.message)
          .to.eql(
            "no data available for getSex() - removed upstream as of Febuary 2020, see issue #33."
          );
        done();
      }
    });

    it("getFullName()", done => {
      data = athlete.getFullName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getRunCount() (.then)", done => {
      athlete
        .getRunCount()
        .then(data => {
          chai.expect(data).to.be.a("number");
          done();
        })
        .catch(err => done(err));
    });

    it("getRuns() (.then)", done => {
      athlete
        .getRuns()
        .then(data => {
          chai.expect(data).to.be.an("array");

          // Expect each item in the array to be an instance of RunResult
          for (var i = 0, len = data.length; i < len; i++) {
            chai.assert(data[i] instanceof RunResult);
          }

          done();
        })
        .catch(err => done(err));
    });

    describe("RunResult", () => {
      let result = null;
      before(async () => {
        // Get a single run and save it
        result = (await athlete.getRuns())[0];
      });

      it("getAgeCategory()", done => {
        data = result.getAgeCategory();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getAgeGradingDecimal()", done => {
        data = result.getAgeGradingDecimal();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getAgeGradingLabel()", done => {
        data = result.getAgeGradingLabel();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getAthleteId()", done => {
        data = result.getAthleteId();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getEventDate()", done => {
        data = result.getEventDate();
        chai.expect(data).to.be.a("date");
        done();
      });

      it("getEventName()", done => {
        data = result.getEventName();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getEventID()", done => {
        data = result.getEventID();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getFinishPosition()", done => {
        data = result.getFinishPosition();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getFirstName()", done => {
        data = result.getFirstName();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getWasFirstRunAtEvent()", done => {
        data = result.getWasFirstRunAtEvent();
        chai.expect(data).to.be.a("boolean");
        done();
      });

      it("getGenderFinishPosition()", done => {
        data = result.getGenderFinishPosition();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getWasGenuinePB()", done => {
        data = result.getWasGenuinePB();
        chai.expect(data).to.be.a("boolean");
        done();
      });

      it("getLastName()", done => {
        data = result.getLastName();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getRunNumber()", done => {
        data = result.getRunNumber();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getFinishTime()", done => {
        data = result.getFinishTime();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getLastUpdated()", done => {
        data = result.getLastUpdated();
        chai.expect(data).to.be.a("date");
        done();
      });

      it("getWasPB()", done => {
        data = result.getWasPB();
        chai.expect(data).to.be.a("boolean");
        done();
      });

      it("getSeriesID()", done => {
        data = result.getSeriesID();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getEventDay()", done => {
        data = result.getEventDay();
        chai.expect(data).to.be.a("string");
        SeriesDayAssert(data);
        done();
      });
    });

    it("getClubs() (.then)", done => {
      athlete
        .getClubs()
        .then(data => {
          chai.expect(data).to.be.an("object");

          chai.assert(data.ParkrunClub != undefined);
          chai.assert(data.JuniorClub != undefined);
          chai.assert(data.VolunteerClub != undefined);

          done();
        })
        .catch(err => done(err));
    });
  });

  describe("Client User (Athlete)", () => {
    athlete = null;
    before("getMe() (await)", async () => {
      athlete = await client.getMe();
    });

    it("getClubID()", done => {
      const data = athlete.getClubID();
      chai.expect(data).to.be.a("number");
      done();
    });

    it("getDOB()", done => {
      const data = athlete.getDOB();
      chai.expect(data).to.be.a("date");
      done();
    });

    // getMobileNumber skipped...

    it("getCommunicationAllowed()", done => {
      const data = athlete.getCommunicationAllowed();
      chai.expect(data).to.be.a("boolean");
      done();
    });

    it("getPostcode()", done => {
      const data = athlete.getPostcode();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getPreSignupExerciseFrequency()", done => {
      const data = athlete.getPreSignupExerciseFrequency();
      chai.expect(data).to.be.a("number");
      done();
    });

    it("getIsWheelchairUser()", done => {
      const data = athlete.getIsWheelchairUser();
      chai.expect(data).to.be.a("boolean");
      done();
    });

    it("getEmail()", done => {
      const data = athlete.getEmail();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getFreedomRuns() (.then)", done => {
      athlete.getFreedomRuns().then(data => {
        chai.expect(data).to.be.an("array");

        // If this user has data available, assert that too.
        if (data.length != 0) chai.assert(data[0] instanceof FreedomRunResult);

        done();
      });
    });

    it("getSex()", done => {
      data = athlete.getSex();
      chai.expect(data).to.be.a("string");
      done();
    });
  });

  describe("Event", () => {
    let event = null;
    const eventID = 191; // Gunnersbury Parkrun, London, UK. Quite popular.
    before(async () => {
      event = await client.getEvent(eventID);
    });

    describe("EventNewsPost (Arr #0)", () => {
      let post = null;
      before(async () => {
        post = (await event.getNews())[0];
      });

      it("getEventID()", done => {
        const data = post.getEventID();
        chai.expect(data).to.be.a("number");
        chai.expect(data).to.eql(eventID);
        done();
      });

      it("getID()", done => {
        const data = post.getID();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getCommentCount()", done => {
        const data = post.getCommentCount();
        chai.expect(data).to.be.a("number");
        done();
      });

      it("getAuthorName()", done => {
        const data = post.getAuthorName();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getAuthorAvatarURL()", done => {
        const data = post.getAuthorAvatarURL();
        chai.expect(data).to.be.a("string");
        done();
      });

      it("getDate()", done => {
        const data = post.getDate();
        chai.expect(data).to.be.a("date");
        done();
      });

      it("getTitle()", done => {
        const data = post.getTitle();
        chai.expect(data).to.be.a("string");
        done();
      });
    });

    describe("RosterVolunteer (Arr #0)", () => {
      let roster = null;
      before(async () => {
        roster = (await event.getRoster())[0];
      });

      it(`getEventNumber()`, done => {
        const data = roster.getEventNumber();
        chai.expect(data).to.be.a("number");
        done();
      });

      it(`getEventDate()`, done => {
        const data = roster.getEventDate();
        chai.expect(data).to.be.a("date");
        done();
      });

      it(`getVolunteerID()`, done => {
        const data = roster.getVolunteerID();
        chai.expect(data).to.be.a("number");
        done();
      });

      it(`getTaskID()`, done => {
        const data = roster.getTaskID();
        chai.expect(data).to.be.a("number");
        done();
      });

      it(`getRosterID()`, done => {
        const data = roster.getRosterID();
        chai.expect(data).to.be.a("number");
        done();
      });

      it(`getTaskName()`, done => {
        const data = roster.getTaskName();
        chai.expect(data).to.be.a("string");
        done();
      });

      it(`getVolunteerFirstName()`, done => {
        const data = roster.getVolunteerFirstName();
        chai.expect(data).to.be.a("string");
        done();
      });

      it(`getVolunteerLastName()`, done => {
        const data = roster.getVolunteerLastName();
        chai.expect(data).to.be.a("string");
        done();
      });
    });

    // getStatsByEvent() cast
    it(`getStats() (.then)`, done => {
      event.getStats().then(data => {
        // https://github.com/Prouser123/parkrun.js/issues/14
        // Currently only returns strings.
        chai.expect(data).to.be.an("object");
        done();
      });
    });

    it(`getID()`, done => {
      const data = event.getID();
      chai.expect(data).to.be.a("number");
      done();
    });

    it(`getInternalName()`, done => {
      const data = event.getInternalName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getShortName()`, done => {
      const data = event.getShortName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getName()`, done => {
      const data = event.getName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getLocation()`, done => {
      const data = event.getLocation();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getCountryCode()`, done => {
      const data = event.getCountryCode();
      chai.expect(data).to.be.a("number");
      done();
    });

    it(`getPreferredLanguage()`, done => {
      const data = event.getPreferredLanguage();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getSeriesID()`, done => {
      const data = event.getSeriesID();
      chai.expect(data).to.be.a("number");
      done();
    });

    it(`getEventDay()`, done => {
      const data = event.getEventDay();
      chai.expect(data).to.be.a("string");
      SeriesDayAssert(data);
      done();
    });

    it(`getIsActive()`, done => {
      const data = event.getIsActive();
      chai.expect(data).to.be.a("boolean");
      done();
    });

    it(`getStatus()`, done => {
      const data = event.getStatus();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getOfficeEmail() (via getEvent)`, done => {
      const data = event.getOfficeEmail();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getHelperEmail() (via getEvent)`, done => {
      const data = event.getHelperEmail();
      chai.expect(data).to.be.a("string");
      done();
    });

    it(`getTotalCount() (via getEvent)`, done => {
      const data = event.getTotalCount();
      chai.expect(data).to.be.a("number");
      done();
    });

    it(`getIsPublic()`, done => {
      const data = event.getIsPublic();
      chai.expect(data).to.be.a("boolean");
      done();
    });
  });

  // Root object function tests

  it(`getStats() (.then)`, done => {
    client.getStats().then(data => {
      // https://github.com/Prouser123/parkrun.js/issues/14
      // Currently only returns strings.
      chai.expect(data).to.be.an("object");
      done();
    });
  });

  it("getStatsByCountry() (.then)", done => {
    client.getStatsByCountry(97).then(data => {
      // https://github.com/Prouser123/parkrun.js/issues/14
      // Currently only returns strings.
      chai.expect(data).to.be.an("object");
      done();
    });
  });

  // getStatsByEvent() already tested in Event object!

  describe("Country (using getActiveCountries())", () => {
    let country = null;
    let countries = null;
    before(async () => {
      countries = await client.getActiveCountries();
      country = countries[0];
    });

    it(`getActiveCountries() should return Class Array`, done => {
      chai.expect(countries).to.be.an("array");

      // Expect each item in the array to be an instance of Country
      for (var i = 0, len = countries.length; i < len; i++) {
        chai.assert(countries[i] instanceof Country);
      }

      done();
    });

    // [ROOT].getAllEventsByCountry() cast
    it(`getAllEvents() (.then)`, done => {
      country.getAllEvents().then(data => {
        // Events class already tested, so we'll only test the response class.

        chai.expect(data).to.be.an("array");

        // Expect each item in the array to be an instance of Country
        for (var i = 0, len = data.length; i < len; i++) {
          chai.assert(data[i] instanceof Event);
        }

        done();
      });
    });

    // Test items such as getTotalCount() that only work directly and so will not here
    describe("getAllEvents() (.then) - Get single event for Indirect Error Testing", () => {
      let event = null;
      before(done => {
        country.getAllEvents().then(arr => {
          event = arr[0];
          done();
        });
      });

      it(`getOfficeEmail() (via getAllEvents[0], expecting DataNotAvailableError)`, done => {
        try {
          event.getOfficeEmail();
        } catch (err) {
          chai.assert(err instanceof DataNotAvailableError);
          done();
        }
      });

      it(`getHelperEmail() (via getAllEvents[0], expecting DataNotAvailableError)`, done => {
        try {
          event.getHelperEmail();
        } catch (err) {
          chai.assert(err instanceof DataNotAvailableError);
          done();
        }
      });

      it(`getTotalCount() (via getAllEvents[0], expecting DataNotAvailableError)`, done => {
        try {
          event.getTotalCount();
        } catch (err) {
          chai.assert(err instanceof DataNotAvailableError);
          done();
        }
      });
    });

    // [ROOT].getAllEventNamesByCountry() cast
    it(`getAllEventNames() (.then)`, done => {
      country.getAllEventNames().then(data => {
        chai.expect(data).to.be.an("array");

        // Expect each item in the array to be a string
        for (var i = 0, len = data.length; i < len; i++) {
          chai.expect(data[i]).to.be.a("string");
        }

        done();
      });
    });

    it("getCode()", done => {
      const data = country.getCode();
      chai.expect(data).to.be.a("number");
      done();
    });

    it("getName()", done => {
      const data = country.getName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getIsActive()", done => {
      const data = country.getIsActive();
      chai.expect(data).to.be.a("boolean");
      chai.assert(data == true); // Since this was requested via getActiveCountries()
      done();
    });

    it("getSiteURL()", done => {
      const data = country.getSiteURL();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getLanguageID()", done => {
      const data = country.getLanguageID();
      chai.expect(data).to.be.a("number");
      done();
    });

    it("getWikiName()", done => {
      const data = country.getWikiName();
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getCCTLD()", done => {
      const data = country.getCCTLD();
      chai.expect(data).to.be.a("string");
      done();
    });
  });

  it("getAllEvents() (.then)", done => {
    client.getAllEvents().then(data => {
      // Events class already tested, so we'll only test the response class.

      chai.expect(data).to.be.an("array");

      // Expect each item in the array to be an instance of Country
      for (var i = 0, len = data.length; i < len; i++) {
        chai.assert(data[i] instanceof Event);
      }

      done();
    });
  });

  it("getAllEventNames()", done => {
    client.getAllEventNames().then(data => {
      // Events class already tested, so we'll only test the response class.

      chai.expect(data).to.be.an("array");

      // Expect each item in the array to be an instance of Country
      for (var i = 0, len = data.length; i < len; i++) {
        chai.expect(data[i]).to.be.a("string");
      }

      done();
    });
  });
});
