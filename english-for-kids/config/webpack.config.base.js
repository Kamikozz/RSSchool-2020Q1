const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/',
  static: 'static/',
  config: 'config/',
  fonts: 'fonts/',
  img: 'img/',
};

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: {
    app: `${PATHS.src}/index.js`,
  },
  output: {
    path: PATHS.dist,
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: '/node_modules/',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  exclude: ['transform-typeof-symbol'], // to prevent IE 11 error
                },
              ],
            ],
          },
        },
        {
          loader: 'eslint-loader',
          options: {
            cache: true,
            // configFile: `${PATHS.config}.eslintrc.js`,
          },
        },
      ],
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            config: {
              path: `${PATHS.config}postcss.config.js`,
            },
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            config: {
              path: `${PATHS.config}postcss.config.js`,
            },
          },
        },
      ],
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }, {
      test: /\.(png|jpe?g|gif|svg)$/i,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }, {
      test: /\.(wav|mp3)$/i,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
      },
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true, // to disable hash for some reasons (true - to boost loading)
      template: `${PATHS.src}/index.html`,
      filename: './index.html',
      inject: true, // if true - to insert link & script tags into html
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}${PATHS.img}`, to: `${PATHS.assets}${PATHS.img}` },
      {
        from: `${PATHS.src}/${PATHS.assets}${PATHS.fonts}`,
        to: `${PATHS.assets}${PATHS.fonts}`,
        ignore: ['*LICENSE*'],
      },
      { from: `${PATHS.src}/${PATHS.assets}icons/`, to: `${PATHS.assets}icons/` },
      { from: `${PATHS.src}/${PATHS.assets}music/`, to: `${PATHS.assets}music/` },
      { from: `${PATHS.src}/${PATHS.static}`, to: '' },
    ]),
  ],
};
