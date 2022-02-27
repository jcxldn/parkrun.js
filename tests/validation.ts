const Parkrun = require("../src/classes/parkrun");

const chai = require("chai");

const { ClientUser, User } = Parkrun.ClassList;

const ValidationError = Parkrun.ClassList._errors.ParkrunValidationError;

chai.should();
describe("Validation", () => {
	it("ClientUser - Invalid Response Data", done => {
		try {
			new ClientUser({});
		} catch (err) {
			chai.expect(err.name).to.eql(ValidationError.name);
			done();
		}
	});

	it("User - Invalid Response Data", done => {
		try {
			new User({});
		} catch (err) {
			chai.expect(err.name).to.eql(ValidationError.name);
			done();
		}
	});
});
