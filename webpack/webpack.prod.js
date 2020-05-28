/* eslint-disable no-undef */

const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    }),
    new webpack.NormalModuleReplacementPlugin(
      /environment\.js/,
      './environment.prod.js'
    ),
    new webpack.NormalModuleReplacementPlugin(
      /_font\.scss/,
      './_font_prod.scss'
    )
  ]
});
