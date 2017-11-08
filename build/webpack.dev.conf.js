const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    vendor: './src/vendor.js',
    app: ['./build/dev-client', './src/index.js']
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
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      chunksSortMode: () => true
    })
  ]
}
