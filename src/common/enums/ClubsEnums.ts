// Source (archived): https://web.archive.org/web/20200105200441/https://support.parkrun.com/hc/en-us/articles/200565303-What-are-the-10-50-100-250-500-Club-

export enum Club {
	NONE,
	TEN_JUNIOR,
	TWENTY_FIVE,
	FIFTY,
	ONE_HUNDRED,
	TWO_HUNDRED_AND_FIFTY,
	FIVE_HUNDRED,
}

/**
 * Enum representing possible club types.
 *
 * Note: parkrun counts "Adult" runs seperately from "Junior" runs.
 */
export enum ClubType {
	ADULT,
	JUNIOR,
	VOLUNTEER,
}

export class ClubUtil {
	/**
	 * Get the respective {@link Club} enum from an athlete's run/volunteer count.
	 * @see (recommended) Use {@link User.getClubs} instead.
	 * @see {@link ClubUtil.calculateFromParkrunResponse} for a method to convert parkrun's clubs response to a set of enums.
	 */
	static calculateFromRunCount = (amount: number, isJunior = false) => {
		if (amount >= 500) return Club.FIVE_HUNDRED;
		if (amount >= 250) return Club.TWO_HUNDRED_AND_FIFTY;
		if (amount >= 100) return Club.ONE_HUNDRED;
		if (amount >= 50) return Club.FIFTY;
		if (amount >= 25) return Club.TWENTY_FIVE;
		if (amount >= 10 && isJunior) return Club.TEN_JUNIOR;
		// Default return
		return Club.NONE;
	};

	static calculateFromParkrunResponse = res => {
		// parkrun (adult) & junior do have club membership variables,
		// but it's easier to just get it from the run // volunteer count.

		// res.parkrunClubMembership = '250'
		// res.JuniorClubMembership = null | 50 | etc
		// res.volcount

		return [
			{ type: ClubType.ADULT, club: this.calculateFromRunCount(res.RunTotal) },
			{ type: ClubType.JUNIOR, club: this.calculateFromRunCount(res.JuniorRunTotal, true) },
			{ type: ClubType.VOLUNTEER, club: this.calculateFromRunCount(res.volcount) },
		];
	};

	static getDisplayName = (club: Club) => {
		switch (club) {
			case Club.NONE:
				return "None";
			case Club.TEN_JUNIOR:
				return "10+ (Junior)";
			case Club.TWENTY_FIVE:
				return "25+";
			case Club.FIFTY:
				return "50+";
			case Club.ONE_HUNDRED:
				return "100+";
			case Club.TWO_HUNDRED_AND_FIFTY:
				return "250+";
			case Club.FIVE_HUNDRED:
				return "500+";
		}
	};
}
