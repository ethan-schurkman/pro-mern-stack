const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/App.jsx',
    vendor: ['react', 'react-dom', 'whatwg-fetch', 'babel-polyfill', 'react-router', 'react-router-bootstrap'],
  },
  output: {
    // path: './static' -- produces an error.
    // path: `${__dirname}/static`,
    path: __dirname + '/static', // eslint-disable-line
    filename: 'app.bundle.js',
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin('vendor','vendor.bundle.js') --> This is deprecated!
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
  devServer: {
    port: 8000,
    contentBase: 'static',
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000',
      },
    },
    historyApiFallback: true,
  },
  devtool: 'source-map',
};
