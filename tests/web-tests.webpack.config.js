const webpack = require("webpack");

const path = require("path");

const glob = require("glob");

module.exports = {
	entry: glob.sync("./tests/*.ts"),
	output: {
		filename: "web-tests.tmp.js",
		path: path.resolve(__dirname, "platform-web"),
		library: "ParkrunTests",
		libraryTarget: "umd",
	},
	externals: {
		chai: "chai",
		describe: "describe",
		"../src": "Parkrun",
	},
	// Loaders
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "ts-loader",
					options: {
						configFile: "tests/tsconfig.webpack-test.json",
					},
				},
				exclude: [/node_modules/],
			},
		],
	},
	resolve: {
		extensions: [".ts"],
	},
	// Plugins
	plugins: [
		new webpack.EnvironmentPlugin({
			ID: process.env.ID,
			PASS: process.env.PASS,
		}),
	],
};
