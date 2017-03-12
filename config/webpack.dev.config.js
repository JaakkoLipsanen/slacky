const webpack = require('webpack');
const config = require('./webpack.base.config'); // extend the base config

config.entry = [
  'webpack/hot/dev-server',
  'webpack-hot-middleware/client',
  'babel-polyfill',
  './client/main.js',
];

config.devtool = '#cheap-module-eval-source-map';
config.devServer = {
  historyApiFallback: true,
  noInfo: true
};
config.performance = { hints: false };

// http://vue-loader.vuejs.org/en/workflow/production.html
config.plugins = (config.plugins || []).concat([
	new webpack.DefinePlugin({
	   'process.env': {
		   NODE_ENV: '"development"'
		}
	}),
	new webpack.HotModuleReplacementPlugin(),
]);

module.exports = config;