const express = require('express');

const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../build/webpack.dev.config');

exports.setup = function(app) {
	const isProduction = app.get('env') != 'development';
	console.log("isprod: " + isProduction + ", " + app.get('env'));
	if(isProduction) {
		// when in dev, the build.js is served by webpack-dev-middleware
		// but in prod, it's compiled to /client/dist/build.js
		app.use(express.static("client/dist"));
	}
	else {
		/* config webpack hot reloading */
		const compiler = webpack(webpackConfig)

		app.use(webpackDevMiddleware(compiler, {
			publicPath: webpackConfig.output.publicPath,
			stats: {  
			colors: true,
            chunks: false, // reduces stuff visible
            'errors-only': true
			}
		}))

		app.use(webpackHotMiddleware(compiler, {
			log: console.log
		}))
	}
}