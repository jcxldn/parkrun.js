const Parkrun = require("../src/classes/parkrun");
const chai = require("chai");

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
});
