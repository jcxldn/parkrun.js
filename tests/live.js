const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");

const RunResult = require("../src/classes/RunResult");

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

    it("getSex()", done => {
      data = athlete.getSex();
      chai.expect(data).to.be.a("string");
      done();
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

    // DESCRIBE RUNRESULT HERE

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
});
