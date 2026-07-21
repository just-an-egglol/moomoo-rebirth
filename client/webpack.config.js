const path = require("path");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

function createConfig(filename, minimize) {
  return {
    entry: path.resolve(__dirname, "src/index.js"),
    mode: isProd ? "production" : "development",
    output: {
      path: path.resolve(__dirname, "../dist/client/assets"),
      filename
    },
    optimization: {
      minimize
    },
    plugins: [
      new DefinePlugin({
        VERSION: JSON.stringify(
          require("./package.json").version + (isProd ? "" : "-dev")
        )
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "public"),
          to: path.resolve(__dirname, "../dist/client")
        }
      ])
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        }
      ]
    }
  };
}

module.exports = [
  createConfig("bundle.js", true),
  createConfig("unminifiedBundle.js", false)
];
