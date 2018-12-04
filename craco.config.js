const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require("path");
const fs = require("fs");
const { whenDev } = require("@craco/craco");

// This injects the monacowebpackplugin into the webpack config that CRA uses.

const contentBase = path.resolve(__dirname, 'public');

module.exports = {
  webpack: {
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },
  devServer: {
    // webpack-dev-server middleware
    before(app) {
      // use proper mime-type for wasm files
      app.get('*.wasm', function (req, res, next) {
        var options = {
          root: contentBase,
          dotfiles: 'deny',
          headers: {
            'Content-Type': 'application/wasm'
          }
        };
        res.sendFile(req.url, options, function (err) {
          if (err) {
            next(err);
          }
        });
      });
    }
  }
};