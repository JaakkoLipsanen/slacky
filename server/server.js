"use-strict";
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('./server-setup').setup(app);
require('./authentication').setup(app);

app.set('db', require('./database'));
app.use(require('./routers/root'));

server.listen(app.get('port'), () => {
	console.log(`Server listening from port ${app.get('port')}`);
});


// todo: move this into it's own file (especially if there's going to be more logic, like there probably will be)
io.use((client, next) => {
	// todo: authentication here?
	next();
}).on('connection', client => { // TODO: atm one client can have multiple connections here... limit to 1 per user
	console.log('New user connected to slacky');

	client.on('messages', data => {
		const message = app.get('db').createMessage(data);
		if(message) {
			io.emit('messages', message);
		}
	});
});