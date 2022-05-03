import {
	AgeGrade,
	AgeGradeUtil,
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
