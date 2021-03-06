// webpack.prod.config.ts の path と名前がかぶってしまいエラーするため変更している
const pathDev = require('path');

module.exports = {
  entry: pathDev.resolve(__dirname, "src/index.tsx"),
  output: {
    path: pathDev.resolve(__dirname, "public"),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use:['style-loader','css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [pathDev.resolve(__dirname, "src"), "node_modules"]
  },
  devtool: "source-map",
  devServer: {
    contentBase: "./public",
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: true
  },
  mode: "development"
};