export const SeriesID = {
	getDayOfWeek(seriesID: number) {
		switch (seriesID) {
			case 1:
				return "Saturday";
			case 2:
				return "Sunday";
			default:
				return "Unknown";
		}
	},
};
