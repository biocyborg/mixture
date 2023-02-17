const path = require("path");

module.exports = {
  entry: {
    mixture: "./src/index.ts",
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "mixture.js",
  },
  mode: "production",

  devtool: false,

  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    fallback: {
      // stream: require.resolve("stream-browserify"),
      // buffer: require.resolve("buffer/"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
};
