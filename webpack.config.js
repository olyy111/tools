module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + "/dist",
    filename: "util.js",
    library: "$",
    libraryTarget: "umd",
    publicPath: "/assets/"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: 'demo/',
    port: 8888,
    inline: true
  }
}