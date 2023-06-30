const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
// const isProd = !isDev;

const filename = (ext) =>
  isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  context: path.resolve(__dirname, "src"),
  // entry: {},
  entry: "./App.js",
  output: {
    filename: `./js/${filename("js")}`,
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    port: 9000,
    hot: true,
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map[query]",
      exclude: ["vendor.js"],
    }),
    new ESLintPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/img"),
          to: path.resolve(__dirname, "dist/assets/img"),
        },
        {
          from: path.resolve(__dirname, "src/assets/favicons"),
          to: path.resolve(__dirname, "dist/assets/favicons"),
        },
        // {
        //   from: path.resolve(__dirname, 'src/assets/svg'),
        //   to: path.resolve(__dirname, 'dist/assets/svg')
        // }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `./css/${filename("css")}`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.pug$/i,
        loader: "pug-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: "asset/resource",
      },
    ],
  },
};

const pathToEntries = path.join(module.exports.context, "pages");
const types = [".js", ".scss"];

["index"].forEach((entryName) => {
  const entryFiles = [];
  const dashedName = toDashString(entryName);
  const pathToEntry = path.join(pathToEntries, dashedName);
  types.forEach((type) => {
    const entryFile = path.join(pathToEntry, `${dashedName}${type}`);
    if (fs.existsSync(entryFile)) {
      entryFiles.push(entryFile);
    }
  });
  if (entryFiles.length) {
    module.exports.entry[entryName] = entryFiles;
  }
  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      template: path.join(pathToEntry, `${dashedName}.pug`),
      filename: `${dashedName}.html`,
      chunks: [entryName],
    })
  );
});

function toDashString(string) {
  const chars = Array.from(string);
  chars.forEach((char, index, array) => {
    if (char === char.toUpperCase()) {
      array[index] = `-${char.toLowerCase()}`;
    }
  });
  return chars.join("");
}
