const Parkrun = require("../../src/classes/parkrun");
const chai = require("chai");
const nock = require("nock");

const _merge = require("lodash.merge");

const ValidationError = require("../../src/errors/ParkrunValidationError");
const UserPassError = require("../../src/errors/ParkrunUserPassError");
const RefreshExpiredError = require("../../src/errors/ParkrunRefreshExpiredError");
const AuthError = require("../../src/errors/ParkrunAuthError");
const DataNotAvailableError = require("../../src/errors/ParkrunDataNotAvailableError");
const NetError = require("../../src/errors/ParkrunNetError");

const refresh = require("../../src/common/refresh");

const getFakeInstance = (callback) => {
  // Get a fake instance
  nock("https://api.parkrun.com").post("/user_auth.php").reply(200, {
    access_token: "access_token",
    expires_in: "7200",
    token_type: "bearer",
    scope: "app",
    refresh_token: "refresh_token",
  });

  Parkrun.authSync("user", "pass").then((parkrun) => {
    callback(parkrun);
  });
};

// Parkrun getUser() response data.
const userResponse = {
  data: {
    Athletes: [
      {
        AthleteID: "1",
        Avatar: "http://avatar.server.tld/avatar.ext",
        ClubName: "Example Club",
        CountryCode: "0", // unused
        FirstName: "Example",
        HomeRunID: "2",
        HomeRunLocation: "Example Location",
        HomeRunName: "Example parkrun",
        LastName: "User",
        OrganisationID: "0", // unused
      },
    ],
  },
};

chai.should();
describe("Mock", () => {
  describe("Authentication", () => {
    it("HTTP 200 OK, no response data.", (done) => {
      nock("https://api.parkrun.com").post("/user_auth.php").reply(200);

      Parkrun.authSync("user", "pass")
        .then(() => done(new Error()))
        .catch((err) => {
          if (err instanceof ValidationError) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 200 OK, valid response data.", (done) => {
      nock("https://api.parkrun.com").post("/user_auth.php").reply(200, {
        access_token: "access_token",
        expires_in: "7200",
        token_type: "bearer",
        scope: "app",
        refresh_token: "refresh_token",
      });

      Parkrun.authSync("user", "pass")
        .then(() => done())
        .catch((err) => done(err));
    });

    // 401s are calculated based on response code only, so currently response data does not matter.
    it("HTTP 401 Unauthorized, no response data", (done) => {
      nock("https://api.parkrun.com").post("/user_auth.php").reply(400);

      Parkrun.authSync("user", "pass")
        .then(() => done(new Error()))
        .catch((err) => {
          if (err instanceof UserPassError) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 401 Unauthorized, valid response data", (done) => {
      nock("https://api.parkrun.com").post("/user_auth.php").reply(400, {
        error: "invalid_grant",
        error_description: "Invalid username and password combination",
      });

      Parkrun.authSync("user", "pass")
        .then(() => done(new Error()))
        .catch((err) => {
          if (err instanceof UserPassError) {
            done();
          } else {
            done(err);
          }
        });
    });
  });

  describe("Event", () => {
    describe("RosterVolunteer", () => {
      let roster = null;
      let date = null;
      before((done) => {
        date = new Date();

        // Get a fake instance
        getFakeInstance((parkrun) => {
          // Get a fake roster
          nock("https://api.parkrun.com")
            .get(
              "/v1/events/0/rosters?expandedDetails=true&access_token=access_token&scope=app"
            )
            .reply(200, {
              data: {
                Rosters: [
                  {
                    EventNumber: "0",
                    eventdate: date,
                    athleteid: "1",
                    taskid: "2",
                    rosterid: "3",
                    TaskName: "Example Task",
                    FirstName: "Example",
                    LastName: "Volunteer",
                  },
                ],
              },
            });

          parkrun.getRoster(0).then((data) => {
            roster = data[0];
            done();
          });
        });
      });
      it(`getEventNumber()`, (done) => {
        const data = roster.getEventNumber();
        chai.expect(data).to.be.a("number");
        chai.expect(data).to.eql(0);
        done();
      });

      it(`getEventDate()`, (done) => {
        const data = roster.getEventDate();
        chai.expect(data).to.be.a("date");
        chai.expect(data).to.eql(date);
        done();
      });

      it(`getVolunteerID()`, (done) => {
        const data = roster.getVolunteerID();
        chai.expect(data).to.be.a("number");
        chai.expect(data).to.eql(1);
        done();
      });

      it(`getTaskID()`, (done) => {
        const data = roster.getTaskID();
        chai.expect(data).to.be.a("number");
        chai.expect(data).to.eql(2);
        done();
      });

      it(`getRosterID()`, (done) => {
        const data = roster.getRosterID();
        chai.expect(data).to.be.a("number");
        chai.expect(data).to.eql(3);
        done();
      });

      it(`getTaskName()`, (done) => {
        const data = roster.getTaskName();
        chai.expect(data).to.be.a("string");
        chai.expect(data).to.eql("Example Task");
        done();
      });

      it(`getVolunteerFirstName()`, (done) => {
        const data = roster.getVolunteerFirstName();
        chai.expect(data).to.be.a("string");
        chai.expect(data).to.eql("Example");
        done();
      });

      it(`getVolunteerLastName()`, (done) => {
        const data = roster.getVolunteerLastName();
        chai.expect(data).to.be.a("string");
        chai.expect(data).to.eql("Volunteer");
        done();
      });
    });
  });

  describe("Refresh", () => {
    it("HTTP 200 OK, no response data", (done) => {
      nock("https://api.parkrun.com").post("/auth/refresh").reply(200);
      refresh("token")
        .then(() => done(new Error())) // This should *never* be called The catch statement should exec instead.
        .catch((err) => {
          if (
            err instanceof Error &&
            err.message == "server did not return any response data!"
          ) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 200 OK, valid response data", (done) => {
      nock("https://api.parkrun.com").post("/auth/refresh").reply(200, {
        access_token: "access",
        token_type: "fake",
        scope: "none",
        expires_in: 3600,
      });
      refresh("token").then((data) => {
        done();
      });
    });

    it("HTTP 400 Bad Request, invalid grant, expired Refresh token", (done) => {
      nock("https://api.parkrun.com").post("/auth/refresh").reply(400, {
        error: "invalid_grant",
        error_description: "Refresh token has expired",
      });
      refresh("token")
        .then(() => done(new Error())) // This should *never* be called The catch statement should exec instead.
        .catch((err) => {
          if (
            err instanceof RefreshExpiredError &&
            err.message == "refresh token has expired"
          ) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 400 Bad Request, invalid grant, invalid refresh token", (done) => {
      nock("https://api.parkrun.com").post("/auth/refresh").reply(400, {
        error: "invalid_grant",
        error_description: "Invalid refresh token",
      });
      refresh("token")
        .then(() => done(new Error())) // This should *never* be called The catch statement should exec instead.
        .catch((err) => {
          if (
            err instanceof AuthError &&
            err.message == "invalid refresh token"
          ) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 400 Bad Request, invalid grant, unknown error details", (done) => {
      nock("https://api.parkrun.com").post("/auth/refresh").reply(400, {
        error: "invalid_grant",
      });
      refresh("token")
        .then(() => done(new Error())) // This should *never* be called The catch statement should exec instead.
        .catch((err) => {
          if (
            err instanceof Error &&
            err.message == "server returned http code 400, invalid grant"
          ) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 400 Bad Request, no response data", (done) => {
      nock("https://api.parkrun.com").post("/auth/refresh").reply(400);
      refresh("token")
        .then(() => done(new Error())) // This should *never* be called The catch statement should exec instead.
        .catch((err) => {
          if (
            err instanceof Error &&
            err.message == "unspecified error during token refresh"
          ) {
            done();
          } else {
            done(err);
          }
        });
    });
  });

  describe("ClientUser", () => {
    athlete = null;
    DOB = new Date();
    const staticData = _merge(userResponse, {
      data: {
        Athletes: [
          {
            ClubID: "3",
            ConfirmCode: "unused!",
            DOB,
            OKtoMail: 1,
            Postcode: "90210",
            PreParkrunExerciseFrequency: "4",
            WheelchairAthlete: 1,
            eMailID: "user@mail.server.tld",
            Sex: "M",
          },
        ],
      },
    });

    before((done) => {
      getFakeInstance((parkrun) => {
        nock("https://api.parkrun.com")
          .get(
            "/v1/me?expandedDetails=true&access_token=access_token&scope=app"
          )
          .reply(
            200,
            _merge(staticData, {
              data: {
                Athletes: [
                  {
                    MobileNumber: "01632960123", // Ofcom [UK Regulator] Drama Number
                  },
                ],
              },
            })
          );

        parkrun.getMe().then((data) => {
          athlete = data;
          done();
        });
      });
    });

    it("createFreedomRun(), HTTP 200 OK, Valid Response Data", (done) => {
      nock("https://api.parkrun.com")
        .post("/v1/freedomruns?access_token=access_token&scope=app")
        .reply(200, {
          data: {
            FreedomRuns: {
              freedomID: 1,
            },
          },
        });
      athlete
        .createFreedomRun("0", "2020", "01", "01", "00:30:00")
        .then((id) => {
          chai.expect(id).to.be.a("number");
          chai.expect(id).to.eql(1);
          done();
        });
    });

    it("createFreedomRun(), HTTP 400 Bad Request", (done) => {
      nock("https://api.parkrun.com")
        .post("/v1/freedomruns?access_token=access_token&scope=app")
        .reply(400);
      athlete
        .createFreedomRun("0", "2020", "01", "01", "00:30:00")
        .catch((err) => {
          if (err instanceof NetError) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("createFreedomRun(), Invalid data lengths (Year)", (done) => {
      athlete
        .createFreedomRun("0", "20201", "01", "01", "00:30:00")
        .catch((err) => {
          err instanceof Error && err.message == "Invalid input!"
            ? done()
            : done(err);
        });
    });

    it("createFreedomRun(), Invalid data lengths (Month)", (done) => {
      athlete
        .createFreedomRun("0", "2020", "012", "01", "00:30:00")
        .catch((err) => {
          err instanceof Error && err.message == "Invalid input!"
            ? done()
            : done(err);
        });
    });

    it("createFreedomRun(), Invalid data lengths (Day)", (done) => {
      athlete
        .createFreedomRun("0", "2020", "01", "012", "00:30:00")
        .catch((err) => {
          err instanceof Error && err.message == "Invalid input!"
            ? done()
            : done(err);
        });
    });

    it("getClubID()", (done) => {
      const data = athlete.getClubID();
      chai.expect(data).to.be.a("number");
      chai.expect(data).to.eql(3);
      done();
    });

    it("getDOB()", (done) => {
      const data = athlete.getDOB();
      chai.expect(data).to.be.a("date");
      chai.expect(data).to.eql(DOB);
      done();
    });

    it("getMobileNumber() (Available)", (done) => {
      const data = athlete.getMobileNumber();
      chai.expect(data).to.eql("01632960123");
      done();
    });

    it("getMobileNumber() (Not Available)", (done) => {
      athlete2 = athlete;
      athlete2._mobileNumber = undefined;
      try {
        athlete2.getMobileNumber();
        done(new Error());
      } catch (err) {
        if (err instanceof DataNotAvailableError) {
          done();
        } else {
          done(err);
        }
      }
    });

    it("getCommunicationAllowed()", (done) => {
      const data = athlete.getCommunicationAllowed();
      chai.expect(data).to.be.a("boolean");
      chai.assert(data); // Assert true, other ways don't work at the moment. (May '20)
      done();
    });

    it("getPostcode()", (done) => {
      const data = athlete.getPostcode();
      chai.expect(data).to.be.a("string");
      chai.expect(data).to.eql("90210");
      done();
    });

    it("getPreSignupExerciseFrequency()", (done) => {
      const data = athlete.getPreSignupExerciseFrequency();
      chai.expect(data).to.be.a("number");
      chai.expect(data).to.eql(4);
      done();
    });

    it("getIsWheelchairUser()", (done) => {
      const data = athlete.getIsWheelchairUser();
      chai.expect(data).to.be.a("boolean");
      chai.assert(data); // Assert true, other ways don't work at the moment. (May '20)
      done();
    });

    it("getEmail()", (done) => {
      const data = athlete.getEmail();
      chai.expect(data).to.be.a("string");
      chai.expect(data).to.eql("user@mail.server.tld");
      done();
    });

    it("getSex()", (done) => {
      data = athlete.getSex();
      chai.expect(data).to.be.a("string");
      chai.expect(data).to.eql("M");
      done();
    });
  });
});
