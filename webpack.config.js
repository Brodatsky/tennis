const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () => {
    const configObj = {
      splitChunks: {
        chunks: 'all'
      }
    };
  
    if (isProd) {
      configObj.minimizer = [
        new OptimizeCssAssetWebpackPlugin(),
        new TerserWebpackPlugin()
      ];
    }
  
    return configObj;
  };


module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './App.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist')
      },
    optimization: optimization(),
    devServer: {
      port: 9000
    },
    plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './pages/index/index.pug',
    }),
    new HtmlWebpackPlugin({
        filename: 'about.html',
        template: './pages/about/about.pug',
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map[query]',
      exclude: ['vendor.js'],
    }),
    new ESLintPlugin(
    ),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
        patterns: [
          { 
            from: path.resolve(__dirname, 'src/assets/img'),
            to: path.resolve(__dirname, 'dist/assets/img') 
          },
          {
            from: path.resolve(__dirname, 'src/assets/favicons'),
            to: path.resolve(__dirname, 'dist/assets/favicons') 
          }
        ]
      }),
    new MiniCssExtractPlugin({
        filename: `./css/${filename('css')}`
    })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader"
            },
            { 
                test: /\.pug$/i,
                loader: "pug-loader" 
            },
            { 
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
            },
            { 
                test: /\.scss$/i,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] 
            },
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource'
            }
        ]
    }
}