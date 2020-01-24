const webpack = require("webpack");

const path = require("path");

module.exports = {
  entry: ["./proxy.js"],
  output: {
    filename: "proxy.min.js",
    path: path.resolve(__dirname)
  },
  // Loaders
  module: {
    rules: [
      // JavaScript/JSX Files (via Babel Loader)
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  // Plugins
  plugins: [
    new webpack.DefinePlugin({ __SHA__: `"${process.env.GITHUB_SHA}"` })
  ]
};
