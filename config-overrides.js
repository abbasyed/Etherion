const webpack = require("webpack");

module.exports = function override(config) {
  // Add polyfills for web3/crypto dependencies
  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    buffer: require.resolve("buffer"),
    process: require.resolve("process/browser"),
  };

  // Add buffer plugin
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  // Ignore source map warnings
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
