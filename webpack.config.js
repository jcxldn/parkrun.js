const webpack = require("webpack");

const path = require("path");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  entry: ["@babel/polyfill", "./src/classes/parkrun.js"],
  output: {
    filename: "parkrun.browser.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "Parkrun"
  },
  resolve: {
    alias: {
      "@hapi/joi": path.resolve(__dirname, "dist/joi.browser.min.js")
    }
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
                  targets: "> 0.25%, not dead"
                  //"modules": "umd"
                }
              ]
            ],
            plugins: ["@babel/plugin-proposal-object-rest-spread"]
          }
        }
      }
    ]
  },
  // Plugins
  plugins: [new webpack.EnvironmentPlugin({ PLATFORM: "WEB" })],
  // Optimizations
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  }
};
