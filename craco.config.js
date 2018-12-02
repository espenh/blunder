const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

// This injects the monacowebpackplugin into the webpack config that CRA uses.

module.exports = {
  webpack: {
    plugins: [
        new MonacoWebpackPlugin()
    ]
  }
};