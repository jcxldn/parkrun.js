const chai = require("chai");

const AgeGradeEnums = require("../src/common/AgeGradeEnums");

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
});
