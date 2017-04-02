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
	app.use((req, res, next) => {

		// TODO: this atm allow all domains. Do I want to allow all domains to connect to the backend?
		res.setHeader('Access-Control-Allow-Credentials', true);
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, *');

		if ('OPTIONS' == req.method) {
			console.log("OPTIONS");
			res.sendStatus(200);
		} else {
			next();
		}
	});
};

exports.setup = (app) => {
	app.set('port', process.env.PORT || 3000);

	app.isProduction = (app.get('env') === 'production');
	if(app.isProduction) {
		forceHTTPS(app);
	}

	enableCORS(app);

	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
};
