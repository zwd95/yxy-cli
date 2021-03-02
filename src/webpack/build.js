require('./build/check-version')()

const webpack = require('webpack')
const rm = require('rimraf')
const symbol = require('log-symbols')
const chalk = require('chalk')
const path = require('path')
const ora = require('ora')
const { isEmptyValue } = require('../utils/type')

const cwd = process.cwd()
const webpackConfig = require('./build/webpack.prod.conf')

const build = ({ env_config }) => {
  if (isEmptyValue(env_config)) {
    env_config = 'prod'
  }

  const env = require(`${cwd}/config/${env_config}.env`)

  webpackConfig.output.publicPath = env.PUBLIC_PATH
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': env
  }))

  const spinner = ora('building for production...')
  spinner.start()

  rm(`${cwd}/dist/static`, err => {
    if (err) throw err

    webpack(webpackConfig, (err, stats) => {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })
}

module.exports = build
