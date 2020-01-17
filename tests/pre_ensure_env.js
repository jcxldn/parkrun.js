if (process.env.ID == undefined) {
  console.error("Missing ID env variable!");
  process.exit(10);
} else if (process.env.PASS == undefined) {
  console.error("Missing PASS env variable!");
  process.exit(11);
} else {
  console.log("Environment checks passed.");
  process.exit(0);
}
