"use-strict";
const express = require('express');
const bodyParser = require('body-parser');

const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const webpackHelper = require('./webpack-helper');
webpackHelper.setup(app)

const AssetFolder = 'public';
app.use(express.static(AssetFolder)); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
})

// todo: normally in express, you'd call app.listen(..), but it doesn't work out of the box
// with socket.io. Not sure if it matters, but look into it
server.listen(3000, function () {
  console.log('App listening on port 3000!')
})


