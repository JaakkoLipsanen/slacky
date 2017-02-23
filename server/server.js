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


// TODO: LOG OUT IS NOT SUPPORTED. IF USER LOGS OUT AND THEN LOGS IN, THERE'S
// TODO!!! encapsulate this into it's own file. maybe message store or i dont know...
io.use(function(client, next) {
	// todo: authentication here?
	next();
}).on('connection', function(client) { // TODO: atm one client can have multiple connections here... limit to 1 per user
	console.log('New user connected to slacky');

	client.on('messages', function(data) {
		const message = app.get('db').createMessage(data);
		if(message) {
			io.emit('messages', message);
		}
	});
});