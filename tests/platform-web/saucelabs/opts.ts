const webdriver = require("selenium-webdriver");

const axios = require("axios").default;

const fs = require("fs");
const path = require("path").resolve(".ci_tmp/images");

const constant_caps = Object.freeze({
	"sauce:options": {
		username: process.env.SAUCE_USERNAME,
		accessKey: process.env.SAUCE_ACCESS_KEY,
		tags: ["parkrun.js"],
		"tunnel-identifier": process.env.GITHUB_RUN_ID,
	},
});

const server_url = "https://ondemand.eu-central-1.saucelabs.com/wd/hub";

export const getBrowsers = () => {
	return [
		// ----- CHROME -----
		_makeBrowserItem({}), // Chrome latest, Windows 10 - defaults
		_makeBrowserItem({ version: "75.0" }), // released June '19

		// ----- FIREFOX -----
		_makeBrowserItem({ platform: "firefox" }), // Latest
		_makeBrowserItem({ platform: "firefox", version: "69.0" }), // released Sept '19

		// Firefox 68 [esr] is not compatible - error during auth flow (12/2)

		// ----- EDGE -----
		_makeBrowserItem({ platform: "MicrosoftEdge" }), // Latest
		_makeBrowserItem({platform: "MicrosoftEdge", version: "79.0"}), // Edge Chromium 1
		// Edge 1X.X (before chrome) is not compatible. (10/4)

		// ----- IE ------
		// IE is not compatible (10/4)

		// ----- MAC | SAFARI -----
		// Safari 8 (osx10.10) Fails to start
		// Safari 9 (osx10.11) Fails to start
		// Safari 10 (osx10.11) Fails to start
		// Safari 11 (macOS 10.12) Fails to start
		// Safari 12 (macOS 10.14) is not compatible - error during auth flow (12/2)

		// _makeBrowserItem("safari", "13.0", "macOS 10.15") Saucelabs application crash
	];
};


const _makeBrowserItem = ({
	browser = "chrome",
	version = "latest",
	platform = "Windows 10"
}) => {
	return {
		browserName: browser,
		browserVersion: version,
		platformName: platform
	}
}

export const makeDriver = _caps => {
	const caps = Object.assign({}, _caps, constant_caps);

	const driver = new webdriver.Builder().withCapabilities(caps).usingServer(server_url);

	const builder = driver.build();

	return { driver, builder };
};

export const run = async ({ driver, builder }) => {
	builder.sessionID = (await builder.getSession()).getId();

	console.log(`[${builder.sessionID}] Driver started.`);

	await builder.get("http://web_tests.nr.jcx.ovh:3000/tests/platform-web/web");

	await builder.wait(async webdriver => {
		return (await webdriver.executeScript("return window.TESTS_COMPLETE")) == true;
	});

	console.log(`[${builder.sessionID}] Tests finished!`);

	// await builder.takeScreenshot()

	const num_passed = Number.parseInt(await builder.executeScript("return window.TESTS_PASSED"));
	const num_failed = Number.parseInt(await builder.executeScript("return window.TESTS_FAILED"));

	fs.writeFileSync(
		`${path}/${builder.sessionID}.json`,
		JSON.stringify({
			image: await builder.executeScript("return window.IMAGE_B64"),
			num_passed,
			num_failed,
			browser: driver.getCapabilities().getBrowserName(),
			version: driver.getCapabilities().getBrowserVersion(),
			platform: driver.getCapabilities().getPlatform(),
		})
	);

	console.log(`[${builder.sessionID}] Passed: ${num_passed} || Failed: ${num_failed}`);

	await axios.put(
		`https://eu-central-1.saucelabs.com/rest/v1/${process.env.SAUCE_USERNAME}/jobs/${builder.sessionID}`,
		{
			passed: num_failed == 0,
			"custom-data": {
				passed: num_passed,
				failed: num_failed,
			},
		},
		{
			auth: {
				username: process.env.SAUCE_USERNAME,
				password: process.env.SAUCE_ACCESS_KEY,
			},
		}
	);

	await builder.quit();
};

console.log(getBrowsers());

fs.mkdirSync(path);
