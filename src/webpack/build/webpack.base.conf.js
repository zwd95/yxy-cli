'use strict'
const path = require('path');
const utils = require('./utils');
const isProduction = process.env.NODE_ENV === 'production';
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const cwd = process.cwd()
const base = (dir) => {
  return `${cwd}/${dir}`
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !isProduction
  }
});

module.exports = {
  context: base('/'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: base('dist'),
    filename: '[name].js'
  },
  resolve: {
    modules: [
      'node_modules',
      resolve('../../node_modules'),
      `${cwd}/node_modules`
    ],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': base('src')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  module: {
    rules: [
      ...(!isProduction ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: ['cache-loader', 'vue-loader'],
        include: [base('src')],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: ['cache-loader', 'babel-loader'],
        // include: [base('src'), resolve('node_modules/webpack-dev-server/client')],
        include: [base('src')],
        exclude: /node_modules/
      },
      // {
      //   test: /\.(png|jpe?g|gif|webp|svg|eot|ttf|woff|woff2|mp4|mp3)$/,
      //   loader: 'url-loader',
      //   options: {
      //     esModule: false,
      //     limit: 10240,
      //     name: utils.assetsPath('img/[name].[hash:7].[ext]')
      //   },
      //   exclude: /node_modules/
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 10240,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 10240,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
          limit: 10240,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(xlsx)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          limit: 10240,
          name: utils.assetsPath('file/[name].[hash:7].[ext]')
        },
        exclude: /node_modules/
      },
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
