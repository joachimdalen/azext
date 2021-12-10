const path = require("path");

module.exports = {
  entry: "./src/azext.ts",
  mode: "development",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "azext",
    path: path.resolve(__dirname, "dist"),
  },
};
