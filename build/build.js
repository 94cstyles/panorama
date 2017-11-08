const path = require('path')
const fs = require('fs')
const del = require('del')
const webpack = require('webpack')
const webpackConfig = require('./webpack.build.conf')

del.sync(path.join(process.cwd(), 'wwwroot'))
webpack(webpackConfig, function (err, stats) {
  if (err) {
    throw err
  } else {
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }))
    process.stdout.write('\n')
  }
})
