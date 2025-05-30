// This file extends the Create React App webpack configuration
// to disable source-map-loader for node_modules

// This is a custom webpack config that will be merged with the CRA config
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        // Exclude all node_modules from source-map-loader
        exclude: /node_modules/,
      },
    ],
  },
  // Prevent webpack from generating warnings about missing source maps
  ignoreWarnings: [/Failed to parse source map/],
}; 