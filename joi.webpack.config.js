"use strict";

const Path = require("path");

const Webpack = require("webpack");

module.exports = {
  entry: "./node_modules/@hapi/joi/lib/index.js",
  output: {
    filename: "joi-browser.min.js",
    path: Path.join(__dirname, "dist"),
    library: "joi",
    libraryTarget: "umd"
  },
  plugins: [
    new Webpack.DefinePlugin({
      Buffer: false
    })
  ],
  module: {
    rules: [
      {
        use: "./node_modules/@hapi/joi/browser/lib/version-loader",
        include: [Path.join(__dirname, "./node_modules/@hapi/joi/package.json")]
      },
      {
        use: "null-loader",
        include: [
          Path.join(__dirname, "./node_modules/@hapi/joi/lib/annotate.js"),
          Path.join(__dirname, "./node_modules/@hapi/joi/lib/manifest.js"),
          Path.join(__dirname, "./node_modules/@hapi/joi/lib/trace.js"),
          Path.join(__dirname, "./node_modules/@hapi/joi/lib/types/binary.js")
          //Path.join(__dirname, "../node_modules/@hapi/address/lib/tlds.js")
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "> 1%, not IE 11, not dead"
                }
              ]
            ],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  },
  node: {
    url: "empty",
    util: "empty"
  }
};
