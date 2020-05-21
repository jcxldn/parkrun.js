const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");
const nock = require("nock");

const ValidationError = require("../src/errors/ParkrunValidationError");
const UserPassError = require("../src/errors/ParkrunUserPassError");
const RefreshExpiredError = require("../src/errors/ParkrunRefreshExpiredError");
const AuthError = require("../src/errors/ParkrunAuthError");

const refresh = require("../src/common/refresh");

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
});
