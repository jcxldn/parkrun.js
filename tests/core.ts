import { Parkrun } from "../src/classes/parkrun";

const { version, license } = require("../package.json");

const { ParkrunUserPassError, ParkrunAuthError } = Parkrun.ClassList._errors;

const { refresh } = Parkrun.ClassList._common;

chai.should();
describe("Core", () => {
	describe("Login (live creds)", () => {
		it("Promise-Based Login (.then)", done => {
			Parkrun.authSync(process.env.ID, process.env.PASS)
				.then(() => {
					done();
				})
				.catch(err => done(err));
		});

		it("Promise-Based Login (await)", async () => {
			await Parkrun.authSync(process.env.ID, process.env.PASS);
		});

		it("Callback-Based Login", done => {
			Parkrun.auth(process.env.ID, process.env.PASS, (client, err) => {
				if (err) {
					done(err);
				} else {
					done();
				}
			});
		});
	});

	it("Login [Sync] (invalid account user/pass)", done => {
		Parkrun.authSync("A124", "fakePassword")
			.then(() => done(new Error()))
			.catch(err => {
				chai.assert(err instanceof ParkrunUserPassError);
				chai.expect(err.message).to.eql("invalid username or password!");
				done();
			});
	});

	it("Login [Callback] (invalid account user/pass)", done => {
		Parkrun.auth("A124", "fakePassword", (client, err) => {
			if (err) {
				chai.assert(err instanceof ParkrunUserPassError);
				chai.expect(err.message).to.eql("invalid username or password!");
				done();
			} else {
				done(new Error());
			}
		});
	});

	it("Refresh (invalid user token)", done => {
		refresh("invalid")
			.then(() => done(new Error()))
			.catch(err => {
				chai.assert(err instanceof ParkrunAuthError);
				chai.expect(err.message).to.eql("invalid refresh token");
				done();
			});
	});

	it("Token Client Recreation (invalid token)", done => {
		Parkrun.recreateTokens({
			access: "access",
			refresh: "refresh",
			access_expiry_date: "1519211809934", // this epoch is in ms, as is done in NodeJS.
		});
		done();
	});

	it("Refresh Token Authentication (.then, invalid token)", done => {
		Parkrun.authRefresh({ token: "invalid" }).catch(err => {
			chai.assert(err instanceof ParkrunAuthError);
			chai.expect(err.message).to.eql("invalid refresh token");
			done();
		});
	});

	it("Refresh Token Authentication (.then, valid token)", done => {
		Parkrun.authSync(process.env.ID, process.env.PASS).then(client => {
			Parkrun.authRefresh({ token: client.getTokens().getRefreshToken() })
				.then(c => {
					chai.assert(c instanceof Parkrun);

					// Sanity check - make sure the token and response instance works
					c.getMe()
						.then(() => {
							done();
						})
						.catch(err => done(err));
				})
				.catch(err => done(err));
		});
	});

	describe("Static variables", () => {
		it("[main].version", done => {
			chai.expect(Parkrun.version).to.eql(version);
			done();
		});

		it("[main].license", done => {
			chai.expect(Parkrun.license).to.eql(license);
			done();
		});
	});
});
