const chai = require("chai");

const ClientUser = require("../src/classes/ClientUser");
const User = require("../src/classes/User");

chai.should();
describe("Validation", () => {
  it("ClientUser - Invalid Response Data", done => {
    try {
      new ClientUser({});
    } catch (err) {
      chai.expect(err.name).to.eql("ParkrunValidationError");
      done();
    }
  });

  it("User - Invalid Response Data", done => {
    try {
      new User({});
    } catch (err) {
      chai.expect(err.name).to.eql("ParkrunValidationError");
      done();
    }
  });
});
