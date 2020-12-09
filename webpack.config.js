const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index_bundle.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
