const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

exports.setup = (app) => {
	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

	// public folders
	app.use(express.static('public')); 
	app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css'))); // so that '/css/bootstrap.min.js' works

	// sets up hot-reloading etc
	require('./webpack-setup').setup(app);
};