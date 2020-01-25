const chai = require("chai");

const DataNotAvailableError = require("../src/errors/ParkrunDataNotAvailableError");
const NetError = require("../src/errors/ParkrunNetError");

chai.should();
describe("Errors", () => {
  it("DataNotAvailableError", done => {
    const err = new DataNotAvailableError("TEST");
    chai.expect(err.message).to.eql("no data available for TEST");
    chai.expect(err.name).to.eql(DataNotAvailableError.name);
    done();
  });

  it("NetError", done => {
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
});
