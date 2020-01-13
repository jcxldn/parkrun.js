// Source (archived): https://web.archive.org/web/20191229114504/https://support.parkrun.com/hc/en-us/articles/200565263-What-is-age-grading-

const AGEGRADE = Object.freeze({
  WORLD_RECORD_BREAKING: "age_grade_10",
  WORLD_RECORD_MATCH: "age_grade_9",
  WORLD_CLASS: "age_grade_4",
  NATIONAL_CLASS: "age_grade_3",
  REGIONAL_CLASS: "age_grade_2",
  LOCAL_CLASS: "age_grade_1",
  NO_GRADE: "age_grade_0"
});

const calculateEnum = decimal => {
  if (decimal > 1) return AGEGRADE.WORLD_RECORD_BREAKING;
  if (decimal == 1) return AGEGRADE.WORLD_RECORD_MATCH;
  if (decimal > 0.9) return AGEGRADE.WORLD_CLASS;
  if (decimal > 0.8) return AGEGRADE.NATIONAL_CLASS;
  if (decimal > 0.7) return AGEGRADE.REGIONAL_CLASS;
  if (decimal > 0.6) return AGEGRADE.LOCAL_CLASS;

  // No other ranks, fallback to no grade.
  return AGEGRADE.NO_GRADE;
};

const getDisplayName = gradeEnum => {
  switch (gradeEnum) {
    case AGEGRADE.WORLD_RECORD_BREAKING:
      return "World Record Breaking";
    case AGEGRADE.WORLD_RECORD_MATCH:
      return "World Record Level";
    case AGEGRADE.WORLD_CLASS:
      return "World Class";
    case AGEGRADE.NATIONAL_CLASS:
      return "National Class";
    case AGEGRADE.REGIONAL_CLASS:
      return "Regional Class";
    case AGEGRADE.LOCAL_CLASS:
      return "Local Class";
    default:
      return "No Grade";
  }
};

module.exports = {
  AGEGRADE,
  calculateEnum,
  getDisplayName
};
