"use-strict";
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('./server-setup').setup(app);
require('./authentication').setup(app);

app.set('db', require('./database'));
app.use(require('./routers/root'));

// todo: normally in express, you'd call app.listen(..), but it doesn't work out of the box
// with socket.io. Not sure if it matters, but look into it
const PORT = process.env.PORT || 3000;
app.set('port', PORT);
server.listen(PORT, function () {
	console.log('Server listening from port ' + PORT );
});


// TODO!!! encapsulate this into it's own file. maybe message store or i dont know...
io.use(function(socket, next) {
	// todo: authentication here?
	next();
}).on('connection', function(client) {
	console.log('New user connected to slacky');

	client.on('messages', function(data) {
		const message = app.get('db').createMessage(data);
		if(message) {
			io.emit('messages', message);
		}
	});
});