const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");

const MODE = process.env.NODE_ENV || "development";
const PRODUCTION = MODE === "production";

module.exports = {
  mode: MODE,
  devtool: PRODUCTION ? "hidden-source-map" : "source-map",
  entry: {
    bundle: "./src/App.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[name].[contenthash].[ext]",
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  devServer: {
    port: 3334,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              minify: PRODUCTION,
              target: "es2016",
              define: { "process.env.NODE_ENV": JSON.stringify(MODE) },
            },
          },
        ],
      },
      {
        test: /\.(jpg|png)$/,
        type: "asset/resource",
        generator: {
          filename: "static/images/[hash][ext][query]",
        },
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "React Native Matsuri",
      template: path.resolve(__dirname, "./index.html"),
    }),
  ].concat([
    new ForkTsCheckerWebpackPlugin({
      async: true,
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(MODE),
    }),
  ]),
  optimization: {
    minimize: true,
    minimizer: PRODUCTION
      ? [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              output: {
                comments: false,
              },
            },
          }),
        ]
      : [],
    splitChunks: {
      cacheGroups: {
        react: {
          test: /react|react-dom/,
          name: "vendor",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  performance: {
    hints: false,
  },
};
