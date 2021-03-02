'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const cwd = process.cwd()
// const env = require(`${cwd}/config/prod.env`)

/** @type {import('webpack').Configuration} */
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',

  output: {
    // publicPath: env.PUBLIC_PATH
  },

  module: {
    rules: utils.styleLoaders('production')
  },

  devtool: 'none',

  output: {
    // path: path.join(__dirname, '..', 'dist'),
    path: `${cwd}/dist`,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // new webpack.DefinePlugin({
    //   'process.env': env
    // }),

    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      ignoreOrder: true
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      // filename: path.join(__dirname, '..', 'dist', 'index.html'),
      filename: `${cwd}/dist/index.html`,
      template: 'index.html',
      // favicon: './favicon.ico',
      favicon: `${cwd}/favicon.ico`,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'auto'
    }),

    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),

    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  optimization: {
    minimize: true,
    namedChunks: true,
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minChunks: 1,
      maxAsyncRequests: 100,
      maxInitialRequests: 100,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //最少引入了1次
        },
        common: {
          test: /[\\/]src[\\/]/,
          minSize: 1024,
          minChunks: 2,
          minSize: 0,
          chunks: "all",
          priority: 5,
          name: 'common'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'] // 移除console
          }
        },
      }),
      new OptimizeCssPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      }),
    ]
  }
})

// 开启gzip
const CompressionWebpackPlugin = require('compression-webpack-plugin')

webpackConfig.plugins.push(
  new CompressionWebpackPlugin({
    test: /\.(?:js|css)$/,
    threshold: 8192,
    minRatio: 0.8
  })
)

const bundleAnalyzerReport = false;

if (bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
