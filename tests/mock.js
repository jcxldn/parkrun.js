const chai = require("chai");

const FreedomRunResult = require("../src/classes/FreedomRunResult");

chai.should();
describe("Mock", () => {
  describe("FreedomRunResult", () => {
    let mocked = null;
    let mocked_data = {
      RunTime: "99:99:00",
      RunDate: new Date(),
      AthleteID: "1234",
      EventNumber: "4321"
    };
    before(async () => {
      mocked = new FreedomRunResult(mocked_data);
    });

    it("getFinishTime()", done => {
      const data = mocked.getFinishTime();
      chai.expect(data).to.eql(mocked_data.RunTime);
      chai.expect(data).to.be.a("string");
      done();
    });

    it("getRunDate()", done => {
      const data = mocked.getRunDate();
      chai.expect(data).to.eql(mocked_data.RunDate);
      chai.expect(data).to.be.a("date");
      done();
    });

    it("getAthleteID()", done => {
      const data = mocked.getAthleteID();
      chai.expect(data).to.eql(1234);
      chai.expect(data).to.be.a("number");
      done();
    });

    it("getEventID()", done => {
      const data = mocked.getEventID();
      chai.expect(data).to.eql(4321);
      chai.expect(data).to.be.a("number");
      done();
    });
  });
});
