const chai = require("chai");

const DataNotAvailableError = require("../src/errors/ParkrunDataNotAvailableError");
const NetError = require("../src/errors/ParkrunNetError");

const AuthError = require("../src/errors/ParkrunAuthError");
const UserPassError = require("../src/errors/ParkrunUserPassError");

chai.should();
describe("Errors", () => {
  it("DataNotAvailableError", done => {
    const err = new DataNotAvailableError("TEST");
    chai.expect(err.message).to.eql("no data available for TEST");
    chai.expect(err.name).to.eql(DataNotAvailableError.name);
    done();
  });

  it("NetError (with res)", done => {
    const err = new NetError({
      response: {
        status: 999,
        statusText: "testStatus",
        config: { method: "test", url: "memes://api.fake.parkrun.com/v1/memes" }
      }
    });
    chai
      .expect(err.message)
      .to.eql("HTTP Error 999 (testStatus) on TEST request to '/v1/memes'");
    chai.expect(err.name).to.eql(NetError.name);
    done();
  });

  it("NetError (no data)", done => {
    const err = new NetError();
    chai.expect(err.message).to.eql("");
    chai.expect(err.name).to.eql(NetError.name);
    done();
  });

  it("AuthError", done => {
    const err = new AuthError("auth error test");
    chai.expect(err.message).to.eql("auth error test");
    chai.expect(err.name).to.eql(AuthError.name);

    chai.assert(err instanceof AuthError);
    chai.assert(err instanceof NetError);
    chai.assert(err instanceof Error);

    done();
  });

  it("UserPassError", done => {
    const err = new UserPassError("UserPass error test");
    chai.expect(err.message).to.eql("UserPass error test");
    chai.expect(err.name).to.eql(UserPassError.name);

    chai.assert(err instanceof UserPassError);
    chai.assert(err instanceof NetError);
    chai.assert(err instanceof Error);

    done();
  });
});
