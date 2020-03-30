const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");
const nock = require("nock");

const ValidationError = require("../src/errors/ParkrunValidationError");
const UserPassError = require("../src/errors/ParkrunUserPassError");

chai.should();
describe("Mock", () => {
  describe("Authentication", () => {
    it("HTTP 200 OK, no response data.", done => {
      nock("https://api.parkrun.com")
        .post("/user_auth.php")
        .reply(200);

      Parkrun.authSync("user", "pass")
        .then(() => done(new Error()))
        .catch(err => {
          if (err instanceof ValidationError) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 200 OK, valid response data.", done => {
      nock("https://api.parkrun.com")
        .post("/user_auth.php")
        .reply(200, {
          access_token: "access_token",
          expires_in: "7200",
          token_type: "bearer",
          scope: "app",
          refresh_token: "refresh_token"
        });

      Parkrun.authSync("user", "pass")
        .then(() => done())
        .catch(err => done(err));
    });

    // 401s are calculated based on response code only, so currently response data does not matter.
    it("HTTP 401 Unauthorized, no response data", done => {
      nock("https://api.parkrun.com")
        .post("/user_auth.php")
        .reply(400);

      Parkrun.authSync("user", "pass")
        .then(() => done(new Error()))
        .catch(err => {
          if (err instanceof UserPassError) {
            done();
          } else {
            done(err);
          }
        });
    });

    it("HTTP 401 Unauthorized, valid response data", done => {
      nock("https://api.parkrun.com")
        .post("/user_auth.php")
        .reply(400, {
          error: "invalid_grant",
          error_description: "Invalid username and password combination"
        });

      Parkrun.authSync("user", "pass")
        .then(() => done(new Error()))
        .catch(err => {
          if (err instanceof UserPassError) {
            done();
          } else {
            done(err);
          }
        });
    });
  });
});
