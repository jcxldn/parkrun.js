const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");

const { version, license } = require("../package.json");

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
