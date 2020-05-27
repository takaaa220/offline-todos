const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./base.webpack.config.js");

const config = merge(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    port: 8081,
    historyApiFallback: true,
  },
});

module.exports = config;
