const path = require('path');

module.exports = {
  mode: 'production',
  entry: './content.js', // Entry point for bundling
  output: {
    filename: 'content.bundle.js', // Output bundled file
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile ES6+ code if necessary
        },
      },
    ],
  },
};
