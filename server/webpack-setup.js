const express = require('express');

exports.setup = function(app) {
	console.log("Setting up webpack for " + (app.isProduction ? "production" : "dev"));
	
	if(app.isProduction) {
		// when in dev, the build.js is served by webpack-dev-middleware
		// but in prod, it's compiled to /client/dist/build.js
		app.use(express.static("client/dist"));
	}
	else {

		/* config webpack hot reloading */
		const webpack = require('webpack');
		const webpackDevMiddleware = require('webpack-dev-middleware');
		const webpackHotMiddleware = require('webpack-hot-middleware');
		const webpackConfig = require('../build/webpack.dev.config');

		const compiler = webpack(webpackConfig);

		app.use(webpackDevMiddleware(compiler, {
			publicPath: webpackConfig.output.publicPath,
			stats: {  
				colors: true,
				chunks: false, // reduces stuff visible
				'errors-only': true
			}
		}));

		app.use(webpackHotMiddleware(compiler, {
			log: console.log
		}));
	}
}