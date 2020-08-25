const Parkrun = require("../src/classes/parkrun");

const chai = require("chai");

const {
  ParkrunDataNotAvailableError,
  ParkrunNetError,
  ParkrunAuthError,
  ParkrunUserPassError,
  ParkrunRefreshExpiredError
} = Parkrun.ClassList._errors;

chai.should();
describe("Errors", () => {
  it("DataNotAvailableError", done => {
    const err = new ParkrunDataNotAvailableError("TEST");
    chai.expect(err.message).to.eql("no data available for TEST");
    chai.expect(err.name).to.eql(ParkrunDataNotAvailableError.name);
    done();
  });

  it("NetError (with res)", done => {
    const err = new ParkrunNetError({
      response: {
        status: 999,
        statusText: "testStatus",
        config: { method: "test", url: "memes://api.fake.parkrun.com/v1/memes" }
      }
    });
    chai
      .expect(err.message)
      .to.eql("HTTP Error 999 (testStatus) on TEST request to '/v1/memes'");
    chai.expect(err.name).to.eql(ParkrunNetError.name);
    done();
  });

  it("NetError (no data)", done => {
    const err = new ParkrunNetError();
    chai.expect(err.message).to.eql("");
    chai.expect(err.name).to.eql(ParkrunNetError.name);
    done();
  });

  it("AuthError", done => {
    const err = new ParkrunAuthError("auth error test");
    chai.expect(err.message).to.eql("auth error test");
    chai.expect(err.name).to.eql(ParkrunAuthError.name);

    chai.assert(err instanceof ParkrunAuthError);
    chai.assert(err instanceof ParkrunNetError);
    chai.assert(err instanceof Error);

    done();
  });

  it("UserPassError", done => {
    const err = new ParkrunUserPassError("UserPass error test");
    chai.expect(err.message).to.eql("UserPass error test");
    chai.expect(err.name).to.eql(ParkrunUserPassError.name);

    chai.assert(err instanceof ParkrunUserPassError);
    chai.assert(err instanceof ParkrunNetError);
    chai.assert(err instanceof Error);

    done();
  });

  it("RefreshExpiredError", done => {
    const err = new ParkrunRefreshExpiredError("RefreshExpired error test");
    chai.expect(err.message).to.eql("RefreshExpired error test");
    chai.expect(err.name).to.eql(ParkrunRefreshExpiredError.name);

    chai.assert(err instanceof ParkrunRefreshExpiredError);
    chai.assert(err instanceof ParkrunNetError);
    chai.assert(err instanceof Error);

    done();
  });
});
