const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

const prodWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    filename: `${baseWebpackConfig.externals.paths.assets}js/[name].[contenthash].js`,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `${baseWebpackConfig.externals.paths.assets}css/[name].[contenthash].css`,
    }),
  ],
});

module.exports = new Promise((resolve) => {
  resolve(prodWebpackConfig);
});
