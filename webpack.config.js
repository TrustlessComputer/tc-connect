const webpack = require('webpack');
const path = require('path');

const NODE_ENV_PRODUCTION = 'production';
const NODE_ENV_DEVELOPMENT = 'development';

const isProduction = process.env.NODE_ENV === NODE_ENV_PRODUCTION;

module.exports = {
  mode: isProduction ? NODE_ENV_PRODUCTION : NODE_ENV_DEVELOPMENT,
  entry: ['./index.ts'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: path.join('[name]', 'index.js'),
    library: 'tc-connect',
    libraryTarget: 'umd', // exposes and know when to use module.exports or exports.
  },
  // output: {
  //   filename: 'index.js',
  //   library: 'tc_connect',
  //   libraryTarget: 'var',
  //   path: path.resolve(process.cwd(), 'dist'),
  // },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      fetch: 'cross-fetch',
    }),
  ],
  optimization: {
    minimize: isProduction,
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      url: require.resolve('url'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      assert: require.resolve('assert'),
    },
  },
};
