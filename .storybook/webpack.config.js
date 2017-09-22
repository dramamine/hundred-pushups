module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css?modules',
      },
      {
        test: /\.txt$/,
        loader: 'raw',
      },
    ],
  },
};
