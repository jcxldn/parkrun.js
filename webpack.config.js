const webpack = require("webpack");

const path = require("path");

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// Generate small package.json with only 'version' and 'license'
const { version, license } = require("./package.json")
// Write it to a file
require("fs").writeFileSync("dist/package.min.json", JSON.stringify({ version, license }));


module.exports = {
  entry: [
    //"./node_modules/axios/dist/axios.min.js",
    "./src/polyfills/btoa.js",
    "fast-text-encoding",
    "regenerator-runtime",
    "./src/classes/parkrun.js",
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
      axios: path.resolve(__dirname, 'node_modules/axios/dist/axios.min.js'),

      // Alias the original package.json to the minified one.
      "../../package.json": path.resolve(__dirname, 'dist/package.min.json'),
    }
  },
  // Prep for webpack 5; also reduce size by not including Buffer (switched to pure js alternatives)
  node: {
    Buffer: false,
    process: false
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
    new webpack.EnvironmentPlugin({ PLATFORM: "WEB" }),
    // BundleAnalyzerPlugin - static file, don't auto open. Useful in webpack development.
    new BundleAnalyzerPlugin({analyzerMode: "static", openAnalyzer: false})
  ],
};
