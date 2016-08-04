module.exports = {
  entry: './js/main',

  output: {
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: "babel" }
    ]
  }
};