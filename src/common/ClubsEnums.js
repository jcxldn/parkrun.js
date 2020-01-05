const CLUBS = Object.freeze({
  undefined: "clubs_0",
  null: "clubs_0",
  // 10 J only
  50: "clubs_1",
  100: "clubs_2",
  250: "clubs_3",
  500: "clubs_4"
});

const VOLUNTEER_CLUBS = Object.freeze({
  undefined: "clubs_voln_0",
  null: "clubs_voln_0",
  25: "clubs_voln_1"
});

const JUNIOR_CLUBS = Object.freeze({
  undefined: "clubs_jr_0",
  null: "clubs_jr_0",
  10: "clubs_jr_1",
  50: "clubs_jr_2",
  100: "clubs_jr_3",
  250: "clubs_jr_4",
  500: "clubs_jr_5"
});

module.exports = {
  CLUBS,
  VOLUNTEER_CLUBS,
  JUNIOR_CLUBS
};
