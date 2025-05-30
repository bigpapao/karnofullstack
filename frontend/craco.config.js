module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find and modify the source-map-loader rule
      const sourceMapLoader = webpackConfig.module.rules.find(
        (rule) => rule.use && rule.use.some && rule.use.some((use) => use.loader && use.loader.includes('source-map-loader'))
      );
      
      if (sourceMapLoader) {
        // Exclude node_modules from source-map-loader
        sourceMapLoader.exclude = /node_modules/;
      }
      
      // Ignore source map warnings
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/
      ];
      
      return webpackConfig;
    },
  },
}; 