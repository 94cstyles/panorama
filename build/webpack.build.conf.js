const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    vendor: './src/vendor.js',
    app: './src/index.js'
  },
  output: {
    path: path.join(process.cwd(), 'wwwroot'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(process.cwd(), 'src'),
        query: {compact: false}
      },
      {
        test: [/three\/examples\/js/],
        use: 'imports-loader?THREE=three'
      }
    ]
  },
  devtool: false,
  plugins: [
    // 压缩js
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: false
    // }),
    // 提取index.html
    new HtmlWebpackPlugin({
      filename: path.join(process.cwd(), 'wwwroot/index.html'),
      template: 'index.html',
      inject: true,
      chunksSortMode: () => false
    })
  ]
}
