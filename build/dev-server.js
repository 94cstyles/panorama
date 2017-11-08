const os = require('os')
const opn = require('opn')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev.conf')

// 获取本地局域网ip
function ip () {
  const iptable = {}
  const ifaces = os.networkInterfaces()
  for (const dev in ifaces) {
    ifaces[dev].forEach(function (details, alias) {
      if (details.family === 'IPv4') {
        iptable[dev + (alias ? ':' + alias : '')] = details.address
      }
    })
  }

  for (const key in iptable) {
    if (iptable[key] !== '127.0.0.1') {
      return iptable[key]
    }
  }
  return '127.0.0.1'
}

const app = express()
const compiler = webpack(webpackConfig)
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: '/',
  quiet: true
})
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})
app.use(devMiddleware)
app.use(hotMiddleware)
app.use(express.static('assets'))

app.listen('3000', () => opn(`http://${ip()}:3000`))
