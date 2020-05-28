/* eslint-disable no-undef */

const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const webpack = require('webpack');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /environment\.js/,
      './environment.dev.js'
    ),
    new webpack.NormalModuleReplacementPlugin(
      /_font\.scss/,
      './_font_prod.scss'
    )
  ]
});
