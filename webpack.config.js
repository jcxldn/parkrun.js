const webpack = require("webpack");

const path = require("path");
const fs = require("fs");

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// Generate small package.json with only 'version' and 'license'
const { version, license } = require("./package.json");
// Create dist dir if it doesn't already exist
if (!fs.existsSync("dist")) fs.mkdirSync("dist");
// Write it to a file
fs.writeFileSync("dist/package.min.json", JSON.stringify({ version, license }));

module.exports = {
	entry: [
		//"./node_modules/axios/dist/axios.min.js",
		"./src/polyfills/btoa.ts",
		"fast-text-encoding",
		"regenerator-runtime",
		"./src/",
	],
	output: {
		filename: "parkrun.browser.min.js",
		path: path.resolve(__dirname, "dist"),
		library: "Parkrun",
		libraryTarget: "umd",
	},
	resolve: {
		alias: {
			// Instead of parsing axios, use the already-parsed minified file, which also does not include Buffer.
			axios: path.resolve(__dirname, "node_modules/axios/dist/axios.min.js"),

			// Alias the original package.json to the minified one.
			"../../package.json": path.resolve(__dirname, "dist/package.min.json"),
		},
	},
	// Loaders
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "ts-loader",
				},
				exclude: [/node_modules/],
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js"], // .js for axios, btoa/atob (in abab module)
	},

	// Plugins
	plugins: [
		new webpack.EnvironmentPlugin({ PLATFORM: "WEB" }),
		// BundleAnalyzerPlugin - static file, don't auto open. Useful in webpack development.
		new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false }),
	],
};
