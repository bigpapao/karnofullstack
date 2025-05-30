// config-overrides.js
const { override, addBabelPlugin, addWebpackPlugin } = require('customize-cra');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = override(
  // Add babel plugins for optimization
  addBabelPlugin([
    'babel-plugin-transform-react-remove-prop-types',
    {
      removeImport: true,
    },
  ]),

  // Add compression plugin to generate gzipped bundles
  addWebpackPlugin(
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240, // Only compress files larger than 10KB
      minRatio: 0.8, // Only compress if compression ratio is better than 0.8
    })
  ),

  // Show bundle analyzer when GENERATE_BUNDLE_REPORT=true
  process.env.GENERATE_BUNDLE_REPORT === 'true' &&
    addWebpackPlugin(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: 'bundle-stats.json',
      })
    ),

  // Custom webpack config function for additional optimizations
  (config) => {
    // Enable aggressive production optimizations
    if (process.env.NODE_ENV === 'production') {
      // Optimize chunking strategy
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000, // 20KB minimum chunk size
          maxSize: 244000, // 244KB maximum chunk size
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // Get package name from node_modules
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];

                // Group packages logically to prevent too many chunks
                if (packageName.includes('@mui')) {
                  return 'mui.bundle';
                }
                if (packageName.includes('react') || packageName.includes('redux')) {
                  return 'react-core.bundle';
                }
                if (packageName === 'axios' || packageName === 'react-query') {
                  return 'api.bundle';
                }

                // For other packages, use one chunk per npm package
                return `vendor.${packageName.replace('@', '')}`;
              },
            },
          },
        },
        moduleIds: 'deterministic', // Keep module.id stable when vendor modules don't change
        runtimeChunk: 'single', // Create a single runtime bundle for all chunks
      };

      // Add image optimization loader
      const imageLoaderRule = {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 75,
              },
              optipng: {
                enabled: true,
                optimizationLevel: 5,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      };

      // Make sure not to add duplicate loader
      const imageRuleIndex = config.module.rules.findIndex(
        (rule) => rule.oneOf && rule.oneOf.some(r => r.test && r.test.toString().includes('png'))
      );

      if (imageRuleIndex !== -1) {
        // Insert image optimization as a preprocess step
        config.module.rules.splice(imageRuleIndex, 0, imageLoaderRule);
      }
    }

    // Find and modify the source-map-loader rule
    const sourceMapRule = config.module.rules.find(
      rule => rule.enforce === 'pre' && rule.use && rule.use.some &&
        rule.use.some(use => use.loader && use.loader.includes('source-map-loader'))
    );

    if (sourceMapRule) {
      // Exclude node_modules from source-map-loader
      sourceMapRule.exclude = /node_modules/;
    }

    // Add ignore warnings configuration
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Failed to parse source map/
    ];

    return config;
  }
);
