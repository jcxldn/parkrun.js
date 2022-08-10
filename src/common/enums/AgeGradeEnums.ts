// Source (archived): https://web.archive.org/web/20191229114504/https://support.parkrun.com/hc/en-us/articles/200565263-What-is-age-grading-

/**
 * Enum representation of an age grade.
 * @see Utility class, {@link AgeGradeUtil}
 */
export enum AgeGrade {
	WORLD_RECORD_BREAKING,
	WORLD_RECORD_MATCH,
	WORLD_CLASS,
	NATIONAL_CLASS,
	REGIONAL_CLASS,
	LOCAL_CLASS,
	NO_GRADE,
}

/**
 * Utility functions for the {@link AgeGrade} enum.
 */
export class AgeGradeUtil {
	static calculateEnum = decimal => {
		if (decimal > 1) return AgeGrade.WORLD_RECORD_BREAKING;
		if (decimal == 1) return AgeGrade.WORLD_RECORD_MATCH;
		if (decimal > 0.9) return AgeGrade.WORLD_CLASS;
		if (decimal > 0.8) return AgeGrade.NATIONAL_CLASS;
		if (decimal > 0.7) return AgeGrade.REGIONAL_CLASS;
		if (decimal > 0.6) return AgeGrade.LOCAL_CLASS;

		// No other ranks, fallback to no grade.
		return AgeGrade.NO_GRADE;
	};

	static getDisplayName = (gradeEnum: AgeGrade) => {
		switch (gradeEnum) {
			case AgeGrade.WORLD_RECORD_BREAKING:
				return "World Record Breaking";
			case AgeGrade.WORLD_RECORD_MATCH:
				return "World Record Level";
			case AgeGrade.WORLD_CLASS:
				return "World Class";
			case AgeGrade.NATIONAL_CLASS:
				return "National Class";
			case AgeGrade.REGIONAL_CLASS:
				return "Regional Class";
			case AgeGrade.LOCAL_CLASS:
				return "Local Class";
			default:
				return "No Grade";
		}
	};
}
