import {
	Parkrun,
	RunResult,
	FreedomRunResult,
	Country,
	Event,
	ParkrunDataNotAvailableError,
	User,
	Club,
	ClubType,
} from "../src";
import { should, assert, expect } from "chai";

const SeriesDayAssert = data => {
	return assert(["Saturday", "Sunday", "Unknown"].includes(data));
};

should();
describe("Live", () => {
	let client: Parkrun;
	before(async () => {
		client = await Parkrun.authSync(process.env.ID, process.env.PASS);
		const me = await client.getMe();

		console.log(`Logged in as '${me.getFullName()}' (ID ${me.getID()})`);
	});

	describe("Tokens", () => {
		it("Current Access Token", done => {
			const token = client.getTokens().getCurrentAccessToken();
			expect(token).to.be.a("string");
			done();
		});

		it("Refresh Token", done => {
			const token = client.getTokens().getRefreshToken();
			expect(token).to.be.a("string");
			done();
		});

		it("Scope", done => {
			const scope = client.getTokens().getScope();
			expect(scope).to.be.a("string");
			expect(scope).to.eql("app");
			done();
		});

		it("Token Type", done => {
			const type = client.getTokens().getTokenType();
			expect(type).to.be.a("string");
			expect(type).to.eql("bearer");
			done();
		});

		it("Boolean Is Valid", done => {
			const bool = client.getTokens().isValid();
			expect(bool).to.be.a("boolean");
			expect(bool).to.eql(true);
			done();
		});

		it("Getter for any valid access token (.then)", done => {
			client
				.getTokens()
				.getValidAccessToken()
				.then(token => {
					expect(token).to.be.a("string");
					done();
				})
				.catch(err => done(err));
		});

		it("Getter for a new access token", async () => {
			await client.getTokens().getNewTokens();
		});
	});

	describe("Athlete", () => {
		let athlete: User = null;
		before("getAthlete (by id, .then)", async () => {
			athlete = await client.getAthlete(198825);
		});

		it("getID()", done => {
			let id = athlete.getID();
			expect(id).to.be.a("number");
			// We start counting from 0
			expect(id.toString().length).to.eql(6);
			done();
		});

		it("getAvatar()", done => {
			const data = athlete.getAvatar();
			expect(data).to.be.a("string");
			done();
		});

		it("getClubName()", done => {
			const data = athlete.getClubName();
			expect(data).to.be.a("string");
			done();
		});

		it("getFirstName()", done => {
			const data = athlete.getFirstName();
			expect(data).to.be.a("string");
			done();
		});

		describe("HomeRun", () => {
			let homerun = null;
			before("getHomeRun()", done => {
				homerun = athlete.getHomeRun();
				done();
			});

			it("getID()", done => {
				const data = homerun.getID();
				expect(data).to.be.a("number");
				done();
			});

			it("getLocation()", done => {
				const data = homerun.getLocation();
				expect(data).to.be.a("string");
				done();
			});

			it("getName()", done => {
				const data = homerun.getName();
				expect(data).to.be.a("string");
				done();
			});
		});

		it("getLastName()", done => {
			const data = athlete.getLastName();
			expect(data).to.be.a("string");
			done();
		});

		it("getSex() [DEPRECATED FUNCTION]", done => {
			try {
				athlete.getSex();
			} catch (err) {
				expect(err.message).to.eql(
					"no data available for getSex() - removed upstream as of Febuary 2020, see issue #33."
				);
				done();
			}
		});

		it("getFullName()", done => {
			const data = athlete.getFullName();
			expect(data).to.be.a("string");
			done();
		});

		it("getRunCount() (.then)", done => {
			athlete
				.getRunCount()
				.then(data => {
					expect(data).to.be.a("number");
					done();
				})
				.catch(err => done(err));
		});

		it("getRuns() (.then)", done => {
			athlete
				.getRuns()
				.then(data => {
					expect(data).to.be.an("array");

					// Expect each item in the array to be an instance of RunResult
					for (var i = 0, len = data.length; i < len; i++) {
						assert(data[i] instanceof RunResult);
					}

					done();
				})
				.catch(err => done(err));
		});

		describe("RunResult", () => {
			let result = null;
			before(async () => {
				// Get a single run and save it
				result = (await athlete.getRuns())[0];
			});

			it("getAgeCategory()", done => {
				const data = result.getAgeCategory();
				expect(data).to.be.a("string");
				done();
			});

			it("getAgeGradingDecimal()", done => {
				const data = result.getAgeGradingDecimal();
				expect(data).to.be.a("number");
				done();
			});

			it("getAgeGradingLabel()", done => {
				const data = result.getAgeGradingLabel();
				expect(data).to.be.a("string");
				done();
			});

			it("getAthleteId()", done => {
				const data = result.getAthleteId();
				expect(data).to.be.a("number");
				done();
			});

			it("getEventDate()", done => {
				const data = result.getEventDate();
				expect(data).to.be.a("date");
				done();
			});

			it("getEventName()", done => {
				const data = result.getEventName();
				expect(data).to.be.a("string");
				done();
			});

			it("getEventID()", done => {
				const data = result.getEventID();
				expect(data).to.be.a("number");
				done();
			});

			it("getFinishPosition()", done => {
				const data = result.getFinishPosition();
				expect(data).to.be.a("number");
				done();
			});

			it("getFirstName()", done => {
				const data = result.getFirstName();
				expect(data).to.be.a("string");
				done();
			});

			it("getWasFirstRunAtEvent()", done => {
				const data = result.getWasFirstRunAtEvent();
				expect(data).to.be.a("boolean");
				done();
			});

			it("getGenderFinishPosition()", done => {
				const data = result.getGenderFinishPosition();
				expect(data).to.be.a("number");
				done();
			});

			it("getWasGenuinePB()", done => {
				const data = result.getWasGenuinePB();
				expect(data).to.be.a("boolean");
				done();
			});

			it("getLastName()", done => {
				const data = result.getLastName();
				expect(data).to.be.a("string");
				done();
			});

			it("getRunNumber()", done => {
				const data = result.getRunNumber();
				expect(data).to.be.a("number");
				done();
			});

			it("getFinishTime()", done => {
				const data = result.getFinishTime();
				expect(data).to.be.a("string");
				done();
			});

			it("getLastUpdated()", done => {
				const data = result.getLastUpdated();
				expect(data).to.be.a("date");
				done();
			});

			it("getWasPB()", done => {
				const data = result.getWasPB();
				expect(data).to.be.a("boolean");
				done();
			});

			it("getSeriesID()", done => {
				const data = result.getSeriesID();
				expect(data).to.be.a("number");
				done();
			});

			it("getEventDay()", done => {
				const data = result.getEventDay();
				expect(data).to.be.a("string");
				SeriesDayAssert(data);
				done();
			});
		});

		it("getClubs() (.then)", done => {
			athlete
				.getClubs()
				.then(data => {
					console.log(data);
					expect(data).to.be.an("array");

					// We know this athlete / user is:
					// Has done 250+ runs (is in 250+ plus runs group)
					/**
					 * We know this athlete / user has:
					 * - Done at least 250 runs
					 * - Done zero junior runs
					 * - Has volunteered at least 25 times
					 */
					assert(data.length == 3);
					assert(data[0].club <= Club.TWO_HUNDRED_AND_FIFTY);
					assert(data[0].type == ClubType.ADULT);

					// This should always be zero (athlete / user is an adult)
					assert(data[1].club <= Club.NONE);
					assert(data[1].type == ClubType.JUNIOR);

					assert(data[2].club <= Club.TWENTY_FIVE);
					assert(data[2].type == ClubType.VOLUNTEER);

					done();
				})
				.catch(err => done(err));
		});

		it("getEvents() (.then)", done => {
			athlete.getEvents().then(data => {
				// Make sure it returns an array
				expect(data).to.be.an("array");

				// Make sure every item in the array is an instance of Event.
				for (var i = 0, len = data.length; i < len; i++) {
					assert(data[i] instanceof Event);
				}
				// Make sure that the array was sorted properly
				expect(data).to.eql(data.sort((a, b) => a.getName().localeCompare(b.getName())));

				// Finish the test
				done();
			});
		});
	});

	describe("Client User (Athlete)", () => {
		let athlete = null;
		before("getMe() (await)", async () => {
			athlete = await client.getMe();
		});

		it("getClubID()", done => {
			const data = athlete.getClubID();
			expect(data).to.be.a("number");
			done();
		});

		it("getDOB()", done => {
			const data = athlete.getDOB();
			expect(data).to.be.a("date");
			done();
		});

		// getMobileNumber skipped...

		it("getCommunicationAllowed()", done => {
			const data = athlete.getCommunicationAllowed();
			expect(data).to.be.a("boolean");
			done();
		});

		it("getPostcode()", done => {
			const data = athlete.getPostcode();
			expect(data).to.be.a("string");
			done();
		});

		it("getPreSignupExerciseFrequency()", done => {
			const data = athlete.getPreSignupExerciseFrequency();
			expect(data).to.be.a("number");
			done();
		});

		it("getIsWheelchairUser()", done => {
			const data = athlete.getIsWheelchairUser();
			expect(data).to.be.a("boolean");
			done();
		});

		it("getEmail()", done => {
			const data = athlete.getEmail();
			expect(data).to.be.a("string");
			done();
		});

		it("getSex()", done => {
			const data = athlete.getSex();
			expect(data).to.be.a("string");
			done();
		});

		describe("Freedom Runs", () => {
			let runs = null;
			before(async () => {
				runs = await athlete.getFreedomRuns();

				// If no runs are available then just create one
				if (runs.length == 0) {
					await athlete.createFreedomRun(953, "2020", "02", "15", "00:15:45");
					runs = await athlete.getFreedomRuns();
				}

				expect(runs).to.be.an("array");
				for (var i = 0, len = runs.length; i < len; i++) {
					assert(runs[i] instanceof FreedomRunResult);
				}
			});

			it("getID() [0]", done => {
				const data = runs[0].getID();
				expect(data).to.be.a("number");
				done();
			});

			it("getEvent() (.then) [0]", done => {
				runs[0].getEvent().then(data => {
					expect(data).to.be.instanceOf(Event);
					expect(data.getName()).to.eql(runs[0].getEventName());
					done();
				});
			});

			it("getEventName() [0]", done => {
				const data = runs[0].getEventName();
				expect(data).to.be.a("string");
				done();
			});

			it("getFinishTime() [0]", done => {
				const data = runs[0].getFinishTime();
				expect(data).to.be.a("string");
				done();
			});

			it("getRunDate() [0]", done => {
				const data = runs[0].getRunDate();
				expect(data).to.be.a("date");
				done();
			});

			it("getAthleteID() [0]", done => {
				const data = runs[0].getAthleteID();
				expect(data).to.be.a("number");
				done();
			});

			it("getEventID() [0]", done => {
				const data = runs[0].getEventID();
				expect(data).to.be.a("number");
				done();
			});
		});
	});

	describe("Event", () => {
		let event = null;
		const eventID = 191; // Gunnersbury Parkrun, London, UK. Quite popular.
		before(async () => {
			event = await client.getEvent(eventID);
		});

		describe("EventNewsPost (Arr #0)", () => {
			let post = null;
			before(async () => {
				post = (await event.getNews())[0];
			});

			it("getEventID()", done => {
				const data = post.getEventID();
				expect(data).to.be.a("number");
				expect(data).to.eql(eventID);
				done();
			});

			it("getID()", done => {
				const data = post.getID();
				expect(data).to.be.a("number");
				done();
			});

			it("getCommentCount()", done => {
				const data = post.getCommentCount();
				expect(data).to.be.a("number");
				done();
			});

			it("getAuthorName()", done => {
				const data = post.getAuthorName();
				expect(data).to.be.a("string");
				done();
			});

			it("getAuthorAvatarURL()", done => {
				const data = post.getAuthorAvatarURL();
				expect(data).to.be.a("string");
				done();
			});

			it("getDate()", done => {
				const data = post.getDate();
				expect(data).to.be.a("date");
				done();
			});

			it("getTitle()", done => {
				const data = post.getTitle();
				expect(data).to.be.a("string");
				done();
			});
		});

		describe("RosterVolunteer (Arr #0)", () => {
			let roster = null;
			before(async () => {
				roster = (await event.getRoster())[0];
			});

			const skipIfNeeded = done => {
				if (!roster) {
					console.error("[Covid-19 Hotfix] No data available! Skipping test...");
					done();
				}
			};

			it(`getEventNumber()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getEventNumber();
				expect(data).to.be.a("number");
				done();
			});

			it(`getEventDate()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getEventDate();
				expect(data).to.be.a("date");
				done();
			});

			it(`getVolunteerID()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getVolunteerID();
				expect(data).to.be.a("number");
				done();
			});

			it(`getTaskID()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getTaskID();
				expect(data).to.be.a("number");
				done();
			});

			it(`getRosterID()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getRosterID();
				expect(data).to.be.a("number");
				done();
			});

			it(`getTaskName()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getTaskName();
				expect(data).to.be.a("string");
				done();
			});

			it(`getVolunteerFirstName()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getVolunteerFirstName();
				expect(data).to.be.a("string");
				done();
			});

			it(`getVolunteerLastName()`, done => {
				skipIfNeeded(done); // COVID-19 Hotfix
				const data = roster.getVolunteerLastName();
				expect(data).to.be.a("string");
				done();
			});
		});

		// getStatsByEvent() cast
		it(`getStats() (.then)`, done => {
			event.getStats().then(data => {
				// https://github.com/Prouser123/parkrun.js/issues/14
				// Currently only returns strings.
				expect(data).to.be.an("object");
				done();
			});
		});

		it(`getID()`, done => {
			const data = event.getID();
			expect(data).to.be.a("number");
			done();
		});

		it(`getInternalName()`, done => {
			const data = event.getInternalName();
			expect(data).to.be.a("string");
			done();
		});

		it(`getShortName()`, done => {
			const data = event.getShortName();
			expect(data).to.be.a("string");
			done();
		});

		it(`getName()`, done => {
			const data = event.getName();
			expect(data).to.be.a("string");
			done();
		});

		it(`getLocation()`, done => {
			const data = event.getLocation();
			expect(data).to.be.a("string");
			done();
		});

		it(`getCountryCode()`, done => {
			const data = event.getCountryCode();
			expect(data).to.be.a("number");
			done();
		});

		it(`getPreferredLanguage()`, done => {
			const data = event.getPreferredLanguage();
			expect(data).to.be.a("string");
			done();
		});

		it(`getSeriesID()`, done => {
			const data = event.getSeriesID();
			expect(data).to.be.a("number");
			done();
		});

		it(`getEventDay()`, done => {
			const data = event.getEventDay();
			expect(data).to.be.a("string");
			SeriesDayAssert(data);
			done();
		});

		it(`getIsActive()`, done => {
			const data = event.getIsActive();
			expect(data).to.be.a("boolean");
			done();
		});

		it(`getStatus()`, done => {
			const data = event.getStatus();
			expect(data).to.be.a("string");
			done();
		});

		it(`getOfficeEmail() (via getEvent)`, done => {
			const data = event.getOfficeEmail();
			expect(data).to.be.a("string");
			done();
		});

		it(`getHelperEmail() (via getEvent)`, done => {
			const data = event.getHelperEmail();
			expect(data).to.be.a("string");
			done();
		});

		it(`getTotalCount() (via getEvent)`, done => {
			const data = event.getTotalCount();
			expect(data).to.be.a("number");
			done();
		});

		it(`getIsPublic()`, done => {
			const data = event.getIsPublic();
			expect(data).to.be.a("boolean");
			done();
		});
	});

	// Root object function tests

	it(`getStats() (.then)`, done => {
		client.getStats().then(data => {
			// https://github.com/Prouser123/parkrun.js/issues/14
			// Currently only returns strings.
			expect(data).to.be.an("object");
			done();
		});
	});

	it("getStatsByCountry() (.then)", done => {
		client.getStatsByCountry(97).then(data => {
			// https://github.com/Prouser123/parkrun.js/issues/14
			// Currently only returns strings.
			expect(data).to.be.an("object");
			done();
		});
	});

	// getStatsByEvent() already tested in Event object!

	describe("Country (using getActiveCountries())", () => {
		let country = null;
		let countries = null;
		before(async () => {
			countries = await client.getActiveCountries();
			country = countries[0];
		});

		it(`getActiveCountries() should return Class Array`, done => {
			expect(countries).to.be.an("array");

			// Expect each item in the array to be an instance of Country
			for (var i = 0, len = countries.length; i < len; i++) {
				assert(countries[i] instanceof Country);
			}

			done();
		});

		// [ROOT].getAllEventsByCountry() cast
		it(`getAllEvents() (.then)`, done => {
			country.getAllEvents().then(data => {
				// Events class already tested, so we'll only test the response class.

				expect(data).to.be.an("array");

				// Expect each item in the array to be an instance of Country
				for (var i = 0, len = data.length; i < len; i++) {
					assert(data[i] instanceof Event);
				}

				done();
			});
		});

		// Test items such as getTotalCount() that only work directly and so will not here
		describe("getAllEvents() (.then) - Get single event for Indirect Error Testing", () => {
			let event = null;
			before(done => {
				country.getAllEvents().then(arr => {
					event = arr[0];
					done();
				});
			});

			it(`getOfficeEmail() (via getAllEvents[0], expecting ParkrunDataNotAvailableError)`, done => {
				try {
					event.getOfficeEmail();
				} catch (err) {
					assert(err instanceof ParkrunDataNotAvailableError);
					done();
				}
			});

			it(`getHelperEmail() (via getAllEvents[0], expecting ParkrunDataNotAvailableError)`, done => {
				try {
					event.getHelperEmail();
				} catch (err) {
					assert(err instanceof ParkrunDataNotAvailableError);
					done();
				}
			});

			it(`getTotalCount() (via getAllEvents[0], expecting ParkrunDataNotAvailableError)`, done => {
				try {
					event.getTotalCount();
				} catch (err) {
					assert(err instanceof ParkrunDataNotAvailableError);
					done();
				}
			});
		});

		// [ROOT].getAllEventNamesByCountry() cast
		it(`getAllEventNames() (.then)`, done => {
			country.getAllEventNames().then(data => {
				expect(data).to.be.an("array");

				// Expect each item in the array to be a string
				for (var i = 0, len = data.length; i < len; i++) {
					expect(data[i]).to.be.a("string");
				}

				done();
			});
		});

		it("getCode()", done => {
			const data = country.getCode();
			expect(data).to.be.a("number");
			done();
		});

		it("getName()", done => {
			const data = country.getName();
			expect(data).to.be.a("string");
			done();
		});

		it("getIsActive()", done => {
			const data = country.getIsActive();
			expect(data).to.be.a("boolean");
			assert(data == true); // Since this was requested via getActiveCountries()
			done();
		});

		it("getSiteURL()", done => {
			const data = country.getSiteURL();
			expect(data).to.be.a("string");
			done();
		});

		it("getLanguageID()", done => {
			const data = country.getLanguageID();
			expect(data).to.be.a("number");
			done();
		});

		it("getWikiName()", done => {
			const data = country.getWikiName();
			expect(data).to.be.a("string");
			done();
		});

		it("getCCTLD()", done => {
			const data = country.getCCTLD();
			expect(data).to.be.a("string");
			done();
		});
	});

	it("getAllEvents() (.then)", done => {
		client.getAllEvents().then(data => {
			// Events class already tested, so we'll only test the response class.

			expect(data).to.be.an("array");

			// Expect each item in the array to be an instance of Country
			for (var i = 0, len = data.length; i < len; i++) {
				assert(data[i] instanceof Event);
			}

			done();
		});
	});

	it("getAllEventNames()", done => {
		client.getAllEventNames().then(data => {
			// Events class already tested, so we'll only test the response class.

			expect(data).to.be.an("array");

			// Expect each item in the array to be an instance of Country
			for (var i = 0, len = data.length; i < len; i++) {
				expect(data[i]).to.be.a("string");
			}

			done();
		});
	});
});
