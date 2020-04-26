const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const Webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist, // where to open webpack (dist folder)
    port: 8081,
    overlay: true,
  },
  output: {
    filename: `${baseWebpackConfig.externals.paths.assets}js/[name].[hash].js`,
  },
  plugins: [
    new Webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
    new MiniCssExtractPlugin({
      filename: `${baseWebpackConfig.externals.paths.assets}css/[name].[hash].css`,
    }),
  ],
});

module.exports = new Promise((resolve) => {
  resolve(devWebpackConfig);
});
