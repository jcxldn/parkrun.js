const webpack = require("webpack");

const path = require("path");

const glob = require("glob");

module.exports = {
  // Nock does not support browsers.
  entry: glob.sync("./tests/*js", { ignore: ["./tests/mock.js"] }),
  output: {
    filename: "web-tests.tmp.js",
    path: path.resolve(__dirname, "tests/platform-web"),
    library: "ParkrunTests",
    libraryTarget: "umd",
  },
  //node: {
  //  http: true, // Polyfill stream-http as the core node 'http' module (it's the default in webpack)
  //  fs: false
  //},
  externals: {
    chai: "chai",
    describe: "describe",
    "../src/classes/parkrun": "Parkrun",
  },
  // Loaders
  module: {
    rules: [
      // JavaScript/JSX Files (via Babel Loader)
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "> 1%, not IE 11, not dead",
                  useBuiltIns: "entry",
                  corejs: "3.6.4",
                  //"modules": "umd"
                },
              ],
            ],
            plugins: ["@babel/plugin-proposal-object-rest-spread"],
          },
        },
      },
    ],
  },
  // Plugins
  plugins: [
    new webpack.EnvironmentPlugin({
      ID: process.env.ID,
      PASS: process.env.PASS,
    }),
  ],
};
