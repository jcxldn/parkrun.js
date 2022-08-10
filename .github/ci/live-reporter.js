const fs = require("fs");
const data = fs.readFileSync(0, "utf-8");

const { ChecksApi } = require("./checks-api");

// Codecov uses % Lines.

get = (line, pos) => {
	return Number.parseFloat(data.split("\n")[line].split("|")[pos].replace(/\s+/g, ""));
};

const lines = get(3, 4);

console.log(`Lines (Codecov metric): '${lines}' percent.`);

const api = new ChecksApi();
api.setup().then(async () => {
	await api.makeCheck({
		name: "ci/cov/live",
		status: "completed",
		conclusion: "neutral",
		title: `${lines}% live-only coverage`,
		summary: "```\n" + data + "\n```",
	});
});
