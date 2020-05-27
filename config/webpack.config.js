const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./base.webpack.config.js");

const config = merge(baseConfig, {
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    port: 8081,
  },
});

module.exports = config;
