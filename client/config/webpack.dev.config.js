const webpack = require('webpack');
const config = require('./webpack.base.config'); // extend the base config

config.entry = [
	'babel-polyfill',
	'./src',
];

config.devtool = '#source-map';
config.devServer = {
	historyApiFallback: true,
	noInfo: true,

	publicPath: "/",
	contentBase: "./public",
	hot: true
};
config.performance = { hints: false };

// http://vue-loader.vuejs.org/en/workflow/production.html
config.plugins = (config.plugins || []).concat([
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('development'),
			SERVER_URL: JSON.stringify('http://localhost:3000')
		}
	}),
	new webpack.HotModuleReplacementPlugin(),
]);

module.exports = config;
