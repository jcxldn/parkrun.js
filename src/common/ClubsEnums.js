// Source (archived): https://web.archive.org/web/20200105200441/https://support.parkrun.com/hc/en-us/articles/200565303-What-are-the-10-50-100-250-500-Clubs-

const CLUBS = Object.freeze({
  null: { id: "c0", name: "No Club" },
  // 10 J only
  50: { id: "c1", name: "50+ Club" },
  100: { id: "c2", name: "100+ Club" },
  250: { id: "c3", name: "250+ Club" },
  500: { id: "c4", name: "500+ Club" }
});

const VOLUNTEER_CLUBS = Object.freeze({
  null: { id: "v0", name: "No Club" },
  25: { id: "v1", name: "Volunteer 25+ Club" }
});

const JUNIOR_CLUBS = Object.freeze({
  null: { id: "j0", name: "No Club" },
  10: { id: "j1", name: "Junior 10+ Club" },
  50: { id: "j2", name: "Junior 50+ Club" },
  100: { id: "j3", name: "Junior 100+ Club" },
  250: { id: "j4", name: "Junior 250+ Club" },
  500: { id: "j5", name: "Junior 500+ Club" }
});

const _volnFromCount = count => {
  if (count >= 25) return VOLUNTEER_CLUBS[25];

  return VOLUNTEER_CLUBS.null;
};

module.exports = {
  CLUBS,
  VOLUNTEER_CLUBS,
  JUNIOR_CLUBS,
  _volnFromCount
};
