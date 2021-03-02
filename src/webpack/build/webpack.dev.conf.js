'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const cwd = process.cwd()

function setWebpackConfig({ port, env_config }) {
  const env = require(`${cwd}/config/${env_config}.env`)

  const devWebpackConfig = merge(baseWebpackConfig, {
    mode: "development",

    output: {
      publicPath: ''
    },

    module: {
      rules: utils.styleLoaders()
    },

    // cheap-module-eval-source-map is faster for development
    devtool: 'cheap-module-eval-source-map',

    // these devServer options should be customized in /config/index.js
    devServer: {
      inline: true,
      progress: true,
      clientLogLevel: 'warning',
      historyApiFallback: {
        rewrites: [
          { from: /.*/, to: `${cwd}/index.html` },
        ],
      },
      hot: true,
      contentBase: false, // since we use CopyWebpackPlugin.
      compress: true,
      host: 'localhost',
      port: null,
      open: true,
      overlay: { warnings: false, errors: true },
      publicPath: '/',
      disableHostCheck: true,//解决127.0.0.1指向其他域名时出现"Invalid Host header"问题
      proxy: {
        '/dev/': {
          target: env.TARGET,
          // https需要的配置 - 必须的参数，不加会报错
          secure: false,
          pathRewrite: {
            '/dev/': '/'
          }
        },
        // 图片
        '/file/': {
          target: env.TARGET,
          // target: 'http://10.33.246.45:9090',
          // https需要的配置 - 必须的参数，不加会报错
          secure: false,
        }
      },
      quiet: true, // necessary for FriendlyErrorsPlugin
      watchOptions: {
        poll: false,
      }
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        favicon: './favicon.ico',
        inject: true
      })
    ]
  })

  return devWebpackConfig
}


module.exports = setWebpackConfig
