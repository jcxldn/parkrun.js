import { ParkrunDataNotAvailableError, ParkrunNetError, ParkrunAuthError, ParkrunUserPassError, ParkrunRefreshExpiredError } from "../src";
import { should, assert, expect } from "chai";
import { AxiosError } from "axios";

should();
describe("Errors", () => {
	it("DataNotAvailableError", done => {
		const err = new ParkrunDataNotAvailableError("TEST");
		expect(err.message).to.eql("no data available for TEST");
		assert(err instanceof ParkrunDataNotAvailableError);
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);
		done();
	});

	it("NetError (with res)", done => {
		const err = new ParkrunNetError("",
			// Cast this object to AxiosError
			<AxiosError><unknown>{
				response: {
					status: 999,
					statusText: "testStatus",
					config: { method: "test", url: "https://api.invalid/v1/invalid" },
				},
			});
		expect(err.message).to.eql("HTTP Error 999 (testStatus) on TEST request to '/v1/invalid'");
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);
		done();
	});

	it("NetError (no data)", done => {
		const err = new ParkrunNetError("generic message");
		expect(err.message).to.eql("generic message");
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);
		done();
	});

	it("AuthError", done => {
		const err = new ParkrunAuthError("auth error test");
		expect(err.message).to.eql("auth error test");
		assert(err instanceof ParkrunAuthError);
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);

		done();
	});

	it("UserPassError", done => {
		const err = new ParkrunUserPassError("UserPass error test");
		expect(err.message).to.eql("UserPass error test");

		assert(err instanceof ParkrunUserPassError);
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);

		done();
	});

	it("RefreshExpiredError", done => {
		const err = new ParkrunRefreshExpiredError("RefreshExpired error test");
		expect(err.message).to.eql("RefreshExpired error test");

		assert(err instanceof ParkrunRefreshExpiredError);
		assert(err instanceof ParkrunNetError);
		assert(err instanceof Error);

		done();
	});
});
