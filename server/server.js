"use-strict";
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('./server-setup').setup(app);
app.set('db', require('./database'));

app.use('/api', require('./api/api.js'));
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

// todo: normally in express, you'd call app.listen(..), but it doesn't work out of the box
// with socket.io. Not sure if it matters, but look into it
server.listen(3000, function () {
  console.log('App listening on port 3000!');
});
