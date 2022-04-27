import { ParkrunDataNotAvailableError, ParkrunNetError, ParkrunAuthError, ParkrunUserPassError, ParkrunRefreshExpiredError } from "../src/errors";
import { should, assert, expect } from "chai";

should();
describe("Errors", () => {
	it("DataNotAvailableError", done => {
		const err = new ParkrunDataNotAvailableError("TEST");
		expect(err.message).to.eql("no data available for TEST");
		expect(err.name).to.eql(ParkrunDataNotAvailableError.name);
		done();
	});

	it("NetError (with res)", done => {
		const err = new ParkrunNetError(JSON.stringify({
			response: {
				status: 999,
				statusText: "testStatus",
				config: { method: "test", url: "memes://api.fake.parkrun.com/v1/memes" },
			},
		}));
		expect(err.message).to.eql("HTTP Error 999 (testStatus) on TEST request to '/v1/memes'");
		expect(err.name).to.eql(ParkrunNetError.name);
		done();
	});

	it("NetError (no data)", done => {
		const err = new ParkrunNetError("generic message");
		expect(err.message).to.eql("");
		expect(err.name).to.eql(ParkrunNetError.name);
		done();
	});

	it("AuthError", done => {
		const err = new ParkrunAuthError("auth error test");
		expect(err.message).to.eql("auth error test");
		expect(err.name).to.eql(ParkrunAuthError.name);

		assert(err instanceof ParkrunAuthError);
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);

		done();
	});

	it("UserPassError", done => {
		const err = new ParkrunUserPassError("UserPass error test");
		expect(err.message).to.eql("UserPass error test");
		expect(err.name).to.eql(ParkrunUserPassError.name);

		assert(err instanceof ParkrunUserPassError);
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);

		done();
	});

	it("RefreshExpiredError", done => {
		const err = new ParkrunRefreshExpiredError("RefreshExpired error test");
		expect(err.message).to.eql("RefreshExpired error test");
		expect(err.name).to.eql(ParkrunRefreshExpiredError.name);

		assert(err instanceof ParkrunRefreshExpiredError);
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);

		done();
	});
});
