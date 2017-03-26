const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const forceHTTPS = (app) => {
	app.use(function(req, res, next) {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect(['https://', req.get('Host'), req.url].join(''));
		}
		return next();
	});
};

// enable cross-origin requests
const enableCORS = (app) => {
	app.use(function (req, res, next) {

	    // Website you wish to allow to connect
	    res.setHeader('Access-Control-Allow-Origin', 'flai.xyz');

		// allow cookies with request (for sessions/auth)
	    res.setHeader('Access-Control-Allow-Credentials', true);

	    // Pass to next layer of middleware
	    next();
	});
};

exports.setup = (app) => {
	app.set('port', process.env.PORT || 3000);

	app.isProduction = (app.get('env') === 'production');
	if(app.isProduction) {
		forceHTTPS(app);
	}

	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

	// public folders
//	app.use(express.static('public'));
	app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css'))); // so that '/css/bootstrap.min.js' works

	// sets up hot-reloading etc
	require('./webpack-setup').setup(app);
};
