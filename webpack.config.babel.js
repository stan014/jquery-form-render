import path from 'path';
import webpack from 'webpack';
export default {
  entry: [
    path.join(__dirname, 'demo/index.js'),
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ],
  output: {
    path: path.join(__dirname, 'demo/assets'),
    filename: 'app.js',
    publicPath: '/assets'
  },
  // resolve: '',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery'}),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [/node_modules/]
      }
    ]
  },
  devtool: 'source-map'
}
