const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");

const { version, license } = require("../package.json");

const UserPassError = require("../src/errors/ParkrunUserPassError");

const refresh = require("../src/common/refresh");

chai.should();
describe("Core", () => {
  describe("Login (live creds)", () => {
    it("Promise-Based Login (.then)", done => {
      Parkrun.authSync(process.env.ID, process.env.PASS)
        .then(() => {
          done();
        })
        .catch(err => done(err));
    });

    it("Promise-Based Login (await)", async () => {
      await Parkrun.authSync(process.env.ID, process.env.PASS);
    });
  });

  it("Login (invalid account user/pass)", done => {
    Parkrun.authSync("A124", "fakePassword")
      .then(() => done(new Error()))
      .catch(err => {
        chai.assert(err instanceof UserPassError);
        chai.expect(err.message).to.eql("invalid username or password!");
        done();
      });
  });

  it("Refresh (invalid user token)", done => {
    refresh("invalid")
      .then(() => done(new Error()))
      .catch(err => {
        chai.assert(err instanceof Error);
        chai.expect(err.message).to.eql("Invalid refresh token");
        done();
      });
  });

  describe("Static variables", () => {
    it("[main].version", done => {
      chai.expect(Parkrun.version).to.eql(version);
      done();
    });

    it("[main].license", done => {
      chai.expect(Parkrun.license).to.eql(license);
      done();
    });
  });
});
