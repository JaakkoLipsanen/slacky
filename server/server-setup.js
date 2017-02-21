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

exports.setup = (app) => {
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