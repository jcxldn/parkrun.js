import {
	AGEGRADE,
	calculateEnum,
	getDisplayName,
	CLUBS,
	VOLUNTEER_CLUBS,
	JUNIOR_CLUBS,
	_volnFromCount,
	SeriesID,
} from "../src";

import { should, expect } from "chai";

should();
describe("Enums", () => {
	describe("AgeGradeEnums", () => {
		it("Enum | AGEGRADE", done => {
			expect(AGEGRADE.WORLD_RECORD_BREAKING).to.equal("age_grade_10");
			expect(AGEGRADE.WORLD_RECORD_MATCH).to.equal("age_grade_9");
			expect(AGEGRADE.WORLD_CLASS).to.equal("age_grade_4");
			expect(AGEGRADE.NATIONAL_CLASS).to.equal("age_grade_3");
			expect(AGEGRADE.REGIONAL_CLASS).to.equal("age_grade_2");
			expect(AGEGRADE.LOCAL_CLASS).to.equal("age_grade_1");
			expect(AGEGRADE.NO_GRADE).to.equal("age_grade_0");

			done();
		});

		it("Helper | calculateEnum", done => {
			expect(calculateEnum(1.1)).to.equal(AGEGRADE.WORLD_RECORD_BREAKING);
			expect(calculateEnum(1)).to.equal(AGEGRADE.WORLD_RECORD_MATCH);
			expect(calculateEnum(0.91)).to.equal(AGEGRADE.WORLD_CLASS);
			expect(calculateEnum(0.9)).to.equal(AGEGRADE.NATIONAL_CLASS);
			expect(calculateEnum(0.8)).to.equal(AGEGRADE.REGIONAL_CLASS);
			expect(calculateEnum(0.7)).to.equal(AGEGRADE.LOCAL_CLASS);
			expect(calculateEnum(0.6)).to.equal(AGEGRADE.NO_GRADE);

			done();
		});

		it("Helper | getDisplayName", done => {
			expect(getDisplayName(AGEGRADE.WORLD_RECORD_BREAKING)).to.equal("World Record Breaking");
			expect(getDisplayName(AGEGRADE.WORLD_RECORD_MATCH)).to.equal("World Record Level");
			expect(getDisplayName(AGEGRADE.WORLD_CLASS)).to.equal("World Class");
			expect(getDisplayName(AGEGRADE.NATIONAL_CLASS)).to.equal("National Class");
			expect(getDisplayName(AGEGRADE.REGIONAL_CLASS)).to.equal("Regional Class");
			expect(getDisplayName(AGEGRADE.LOCAL_CLASS)).to.equal("Local Class");
			expect(getDisplayName(AGEGRADE.NO_GRADE)).to.equal("No Grade");

			done();
		});
	});

	describe("ClubsEnums", () => {
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
	});

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
