const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");
const nock = require("nock");

const ValidationError = require("../src/errors/ParkrunValidationError");

chai.should();
describe("Mock", () => {
  describe("Authentication", () => {
    it("HTTP 200 OK, no response data.", done => {
      nock("https://api.parkrun.com")
        .post("/user_auth.php")
        .reply(200)
        .log(console.log);

      Parkrun.authSync("user", "pass").catch(err => {
        if (err instanceof ValidationError) {
          done();
        } else {
          done(err);
        }
      });
    });
  });
});
