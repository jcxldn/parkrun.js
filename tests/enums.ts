import { AgeGrade, AgeGradeUtil, Club, ClubUtil, SeriesID } from "../src";

import { assert, should, expect } from "chai";

should();
describe("Enums", () => {
	describe("AgeGradeEnums", () => {
		it("calculateEnum", done => {
			expect(AgeGradeUtil.calculateEnum(1.1)).to.equal(AgeGrade.WORLD_RECORD_BREAKING);
			expect(AgeGradeUtil.calculateEnum(1)).to.equal(AgeGrade.WORLD_RECORD_MATCH);
			expect(AgeGradeUtil.calculateEnum(0.91)).to.equal(AgeGrade.WORLD_CLASS);
			expect(AgeGradeUtil.calculateEnum(0.9)).to.equal(AgeGrade.NATIONAL_CLASS);
			expect(AgeGradeUtil.calculateEnum(0.8)).to.equal(AgeGrade.REGIONAL_CLASS);
			expect(AgeGradeUtil.calculateEnum(0.7)).to.equal(AgeGrade.LOCAL_CLASS);
			expect(AgeGradeUtil.calculateEnum(0.6)).to.equal(AgeGrade.NO_GRADE);

			done();
		});

		it("getDisplayName", done => {
			expect(AgeGradeUtil.getDisplayName(AgeGrade.WORLD_RECORD_BREAKING)).to.equal(
				"World Record Breaking"
			);
			expect(AgeGradeUtil.getDisplayName(AgeGrade.WORLD_RECORD_MATCH)).to.equal(
				"World Record Level"
			);
			expect(AgeGradeUtil.getDisplayName(AgeGrade.WORLD_CLASS)).to.equal("World Class");
			expect(AgeGradeUtil.getDisplayName(AgeGrade.NATIONAL_CLASS)).to.equal("National Class");
			expect(AgeGradeUtil.getDisplayName(AgeGrade.REGIONAL_CLASS)).to.equal("Regional Class");
			expect(AgeGradeUtil.getDisplayName(AgeGrade.LOCAL_CLASS)).to.equal("Local Class");
			expect(AgeGradeUtil.getDisplayName(AgeGrade.NO_GRADE)).to.equal("No Grade");

			done();
		});
	});

	describe("ClubsEnums", () => {
		it("Clubs have increasing value", done => {
			expect(Club.NONE).to.eql(0);
			expect(Club.TEN_JUNIOR).to.eql(1);
			expect(Club.TWENTY_FIVE).to.eql(2);
			expect(Club.FIFTY).to.eql(3);
			expect(Club.ONE_HUNDRED).to.eql(4);
			expect(Club.TWO_HUNDRED_AND_FIFTY).to.eql(5);
			expect(Club.FIVE_HUNDRED).to.eql(6);

			done();
		});

		describe("calculateFromRunCount", () => {
			const permutations = [
				// Adult permutations
				[Club.NONE, 0, 24, 0],
				[Club.TWENTY_FIVE, 25, 49, 0],
				[Club.FIFTY, 50, 99, 0],
				[Club.ONE_HUNDRED, 100, 249, 0],
				[Club.TWO_HUNDRED_AND_FIFTY, 250, 499, 0],
				[Club.FIVE_HUNDRED, 500, 501, 0], // Club 500 is the highest club (500+ runs)
				// Junior permutations
				[Club.NONE, 0, 9, 1],
				[Club.TEN_JUNIOR, 10, 24, 1],
				[Club.TWENTY_FIVE, 25, 49, 1],
				[Club.FIFTY, 50, 99, 1],
				[Club.ONE_HUNDRED, 100, 249, 1],
				[Club.TWO_HUNDRED_AND_FIFTY, 250, 499, 1],
				[Club.FIVE_HUNDRED, 500, 501, 1], // Club 500 is the highest club (500+ runs)
			];

			permutations.forEach(permutation => {
				// Assign array items to variables to make them clearer
				const club = permutation[0];
				const clubEnum = Club[club];
				const minValue = permutation[1];
				const maxValue = permutation[2];
				const isJunior = Boolean(permutation[3]);

				// Make a test for each item in the array
				it(`Club.${clubEnum}, ${minValue}-${maxValue} runs${isJunior ? " (junior)" : ""}`, done => {
					for (let i = minValue; i <= maxValue; i++) {
						expect(ClubUtil.calculateFromRunCount(i, isJunior)).to.eql(club);
					}
					done();
				});
			});
		});
	});

	// TODO: Need to rewrite these tests
	// TODO: (Optional): Use nock for e2e coverage for this enum's util functions.
	/*describe("ClubsEnums", () => {
		it("Enum | CLUBS", done => {
			expect(CLUBS[0]).to.deep.equal({
				id: "c0",
				name: "No Club",
			});

			expect(CLUBS[50]).to.deep.equal({
				id: "c1",
				name: "50+ Club",
			});

			expect(CLUBS[100]).to.deep.equal({
				id: "c2",
				name: "100+ Club",
			});

			expect(CLUBS[250]).to.deep.equal({
				id: "c3",
				name: "250+ Club",
			});

			expect(CLUBS[500]).to.deep.equal({
				id: "c4",
				name: "500+ Club",
			});

			done();
		});

		it("Enum | VOLUNTEER_CLUBS", done => {
			expect(VOLUNTEER_CLUBS[0]).to.deep.equal({
				id: "v0",
				name: "No Club",
			});

			expect(VOLUNTEER_CLUBS[25]).to.deep.equal({
				id: "v1",
				name: "Volunteer 25+ Club",
			});

			done();
		});

		it("Enum | JUNIOR_CLUBS", done => {
			expect(JUNIOR_CLUBS[0]).to.deep.equal({
				id: "j0",
				name: "No Club",
			});

			expect(JUNIOR_CLUBS[10]).to.deep.equal({
				id: "j1",
				name: "Junior 10+ Club",
			});

			expect(JUNIOR_CLUBS[50]).to.deep.equal({
				id: "j2",
				name: "Junior 50+ Club",
			});

			expect(JUNIOR_CLUBS[100]).to.deep.equal({
				id: "j3",
				name: "Junior 100+ Club",
			});

			expect(JUNIOR_CLUBS[250]).to.deep.equal({
				id: "j4",
				name: "Junior 250+ Club",
			});

			expect(JUNIOR_CLUBS[500]).to.deep.equal({
				id: "j5",
				name: "Junior 500+ Club",
			});

			done();
		});

		it("Helper | _volnFromCount", done => {
			expect(_volnFromCount(0)).to.deep.equal(VOLUNTEER_CLUBS[0]);

			expect(_volnFromCount(24)).to.deep.equal(VOLUNTEER_CLUBS[0]);

			expect(_volnFromCount(25)).to.deep.equal(VOLUNTEER_CLUBS[25]);

			expect(_volnFromCount(26)).to.deep.equal(VOLUNTEER_CLUBS[25]);

			done();
		});
	}); */

	// TODO: This should really in core.ts?
	describe("SeriesID", () => {
		it("getDayOfWeek", done => {
			expect(SeriesID.getDayOfWeek(1)).to.equal("Saturday");
			expect(SeriesID.getDayOfWeek(2)).to.equal("Sunday");
			expect(SeriesID.getDayOfWeek(0)).to.equal("Unknown");
			expect(SeriesID.getDayOfWeek(3)).to.equal("Unknown");

			done();
		});
	});
});
