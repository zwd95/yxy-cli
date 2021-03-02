'use strict'
const cwd = process.cwd()
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

try {
  const packageConfig = require(`${cwd}/package.json`)
} catch (err) {

}

exports.assetsPath = function(_path) {
  return path.posix.join('static', _path)
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = [{
    test: /\.(sa|sc|c)ss$/,
    use: [
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ],
  }];
  if (options === 'production') {
    output[0].use.unshift({
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '../../',
      },
    })
  } else {
    output[0].use.unshift('vue-style-loader')
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
