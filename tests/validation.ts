import { ClientUser, User } from "../src/classes"
import { ParkrunValidationError } from "../src/errors";
import { should, expect } from "chai";


should();
describe("Validation", () => {
	it("ClientUser - Invalid Response Data", done => {
		try {
			new ClientUser({}, null);
		} catch (err) {
			expect(err.name).to.eql(ParkrunValidationError.name);
			done();
		}
	});

	it("User - Invalid Response Data", done => {
		try {
			new User({}, null);
		} catch (err) {
			expect(err.name).to.eql(ParkrunValidationError.name);
			done();
		}
	});
});
