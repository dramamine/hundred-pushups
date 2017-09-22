const path = require('path');
// @TODO don't think txt loader is working right
module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css?modules'
      },
      {
        test: /\.txt$/,
        loader: 'raw'
      }
    ]
  }
}