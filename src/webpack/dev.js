const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const chalk = require('chalk')
const utils = require('./build/utils')
const path = require('path')
const { isEmptyValue } = require('../utils/type')

const cwd = process.cwd()
const target = 'https://cmms3.meicloud.com';


const dev = ({ port, env_config }) => {
  if (isEmptyValue(env_config)) {
    env_config = 'dev'
  }

  const webpackConfig  = require('./build/webpack.dev.conf')({ port, env_config })
  const defaultPort = webpackConfig.devServer.port

  // 配置文件有配置 port 就采用配置文件的，没有就采用默认值 3000
  if (port && !defaultPort) {
    process.env.PORT = port
    webpackConfig.devServer.port = port
  }

  // 配置全局变量
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': require(`${cwd}/config/${env_config}.env`)
  }))

  // 校验端口号否可以用
  portfinder.basePort = webpackConfig.devServer.port
  portfinder.getPort((err, port) => {
    if (err) {
      chalk.red(err.message)
    } else {
      process.env.PORT = port

      webpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${webpackConfig.devServer.host}:${port}`],
        },
        onErrors: utils.createNotifierCallback()
      }))

      new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer)
        .listen(port, 'localhost', function (err, result) {
          if (err) {
            console.log(err)
          }
        })
    }
  })


}

module.exports = dev
