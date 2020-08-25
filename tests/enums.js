const Parkrun = require("../src/classes/parkrun");

const chai = require("chai");

const { AgeGradeEnums, ClubsEnums, SeriesID } = Parkrun.ClassList._common;

chai.should();
describe("Enums", () => {
  describe("AgeGradeEnums", () => {
    it("Enum | AGEGRADE", done => {
      chai
        .expect(AgeGradeEnums.AGEGRADE.WORLD_RECORD_BREAKING)
        .to.eql("age_grade_10");
      chai
        .expect(AgeGradeEnums.AGEGRADE.WORLD_RECORD_MATCH)
        .to.eql("age_grade_9");
      chai.expect(AgeGradeEnums.AGEGRADE.WORLD_CLASS).to.eql("age_grade_4");
      chai.expect(AgeGradeEnums.AGEGRADE.NATIONAL_CLASS).to.eql("age_grade_3");
      chai.expect(AgeGradeEnums.AGEGRADE.REGIONAL_CLASS).to.eql("age_grade_2");
      chai.expect(AgeGradeEnums.AGEGRADE.LOCAL_CLASS).to.eql("age_grade_1");
      chai.expect(AgeGradeEnums.AGEGRADE.NO_GRADE).to.eql("age_grade_0");

      done();
    });

    it("Helper | calculateEnum", done => {
      chai
        .expect(AgeGradeEnums.calculateEnum(1.1))
        .to.eql(AgeGradeEnums.AGEGRADE.WORLD_RECORD_BREAKING);
      chai
        .expect(AgeGradeEnums.calculateEnum(1))
        .to.eql(AgeGradeEnums.AGEGRADE.WORLD_RECORD_MATCH);
      chai
        .expect(AgeGradeEnums.calculateEnum(0.91))
        .to.eql(AgeGradeEnums.AGEGRADE.WORLD_CLASS);
      chai
        .expect(AgeGradeEnums.calculateEnum(0.9))
        .to.eql(AgeGradeEnums.AGEGRADE.NATIONAL_CLASS);
      chai
        .expect(AgeGradeEnums.calculateEnum(0.8))
        .to.eql(AgeGradeEnums.AGEGRADE.REGIONAL_CLASS);
      chai
        .expect(AgeGradeEnums.calculateEnum(0.7))
        .to.eql(AgeGradeEnums.AGEGRADE.LOCAL_CLASS);
      chai
        .expect(AgeGradeEnums.calculateEnum(0.6))
        .to.eql(AgeGradeEnums.AGEGRADE.NO_GRADE);

      done();
    });

    it("Helper | getDisplayName", done => {
      chai
        .expect(
          AgeGradeEnums.getDisplayName(
            AgeGradeEnums.AGEGRADE.WORLD_RECORD_BREAKING
          )
        )
        .to.eql("World Record Breaking");
      chai
        .expect(
          AgeGradeEnums.getDisplayName(
            AgeGradeEnums.AGEGRADE.WORLD_RECORD_MATCH
          )
        )
        .to.eql("World Record Level");
      chai
        .expect(
          AgeGradeEnums.getDisplayName(AgeGradeEnums.AGEGRADE.WORLD_CLASS)
        )
        .to.eql("World Class");
      chai
        .expect(
          AgeGradeEnums.getDisplayName(AgeGradeEnums.AGEGRADE.NATIONAL_CLASS)
        )
        .to.eql("National Class");
      chai
        .expect(
          AgeGradeEnums.getDisplayName(AgeGradeEnums.AGEGRADE.REGIONAL_CLASS)
        )
        .to.eql("Regional Class");
      chai
        .expect(
          AgeGradeEnums.getDisplayName(AgeGradeEnums.AGEGRADE.LOCAL_CLASS)
        )
        .to.eql("Local Class");
      chai
        .expect(AgeGradeEnums.getDisplayName(AgeGradeEnums.AGEGRADE.NO_GRADE))
        .to.eql("No Grade");

      done();
    });
  });

  describe("ClubsEnums", () => {
    it("Enum | CLUBS", done => {
      chai.expect(ClubsEnums.CLUBS[null]).to.deep.eql({
        id: "c0",
        name: "No Club"
      });

      chai.expect(ClubsEnums.CLUBS[50]).to.deep.eql({
        id: "c1",
        name: "50+ Club"
      });

      chai.expect(ClubsEnums.CLUBS[100]).to.deep.eql({
        id: "c2",
        name: "100+ Club"
      });

      chai.expect(ClubsEnums.CLUBS[250]).to.deep.eql({
        id: "c3",
        name: "250+ Club"
      });

      chai.expect(ClubsEnums.CLUBS[500]).to.deep.eql({
        id: "c4",
        name: "500+ Club"
      });

      done();
    });

    it("Enum | VOLUNTEER_CLUBS", done => {
      chai.expect(ClubsEnums.VOLUNTEER_CLUBS.null).to.deep.eql({
        id: "v0",
        name: "No Club"
      });

      chai.expect(ClubsEnums.VOLUNTEER_CLUBS[25]).to.deep.eql({
        id: "v1",
        name: "Volunteer 25+ Club"
      });

      done();
    });

    it("Enum | JUNIOR_CLUBS", done => {
      chai.expect(ClubsEnums.JUNIOR_CLUBS[null]).to.deep.eql({
        id: "j0",
        name: "No Club"
      });

      chai.expect(ClubsEnums.JUNIOR_CLUBS[10]).to.deep.eql({
        id: "j1",
        name: "Junior 10+ Club"
      });

      chai.expect(ClubsEnums.JUNIOR_CLUBS[50]).to.deep.eql({
        id: "j2",
        name: "Junior 50+ Club"
      });

      chai.expect(ClubsEnums.JUNIOR_CLUBS[100]).to.deep.eql({
        id: "j3",
        name: "Junior 100+ Club"
      });

      chai.expect(ClubsEnums.JUNIOR_CLUBS[250]).to.deep.eql({
        id: "j4",
        name: "Junior 250+ Club"
      });

      chai.expect(ClubsEnums.JUNIOR_CLUBS[500]).to.deep.eql({
        id: "j5",
        name: "Junior 500+ Club"
      });

      done();
    });

    it("Helper | _volnFromCount", done => {
      chai
        .expect(ClubsEnums._volnFromCount(0))
        .to.deep.eql(ClubsEnums.VOLUNTEER_CLUBS.null);

      chai
        .expect(ClubsEnums._volnFromCount(24))
        .to.deep.eql(ClubsEnums.VOLUNTEER_CLUBS.null);

      chai
        .expect(ClubsEnums._volnFromCount(25))
        .to.deep.eql(ClubsEnums.VOLUNTEER_CLUBS[25]);

      chai
        .expect(ClubsEnums._volnFromCount(26))
        .to.deep.eql(ClubsEnums.VOLUNTEER_CLUBS[25]);

      done();
    });
  });

  describe("SeriesID", () => {
    it("getDayOfWeek", done => {
      chai.expect(SeriesID.getDayOfWeek(1)).to.eql("Saturday");
      chai.expect(SeriesID.getDayOfWeek(2)).to.eql("Sunday");
      chai.expect(SeriesID.getDayOfWeek(0)).to.eql("Unknown");
      chai.expect(SeriesID.getDayOfWeek(3)).to.eql("Unknown");

      done();
    });
  });
});
