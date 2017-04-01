const webpack = require('webpack');
const config = require('./webpack.base.config'); // extend the base config

config.entry = ['babel-polyfill','./client/main.js'];
config.devtool = false;
config.performance = { hints: "error" };

// http://vue-loader.vuejs.org/en/workflow/production.html
config.plugins = (config.plugins || []).concat([
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
			SERVER_URL: JSON.stringify("https://slacky-api.herokuapp.com/")
		}
	}),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: true
	}),
])

module.exports = config;