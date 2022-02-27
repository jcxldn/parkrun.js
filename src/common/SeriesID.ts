const SeriesID = {
  getDayOfWeek(seriesID) {
    switch (seriesID) {
      case 1:
        return "Saturday";
      case 2:
        return "Sunday";
      default:
        return "Unknown";
    }
  }
};

module.exports = SeriesID;
