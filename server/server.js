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
	client.on('messages', payload => {
		if(payload.action === 'create') {
			app.get('db').createMessage(payload.room, payload.sender, payload.message)
			.then(message => {			
				if(message) {
					io.emit('messages', { action: 'create', room: payload.room, sender: payload.sender, timestamp: message.timestamp, message: payload.message }); // TODO: don't use payload. but message.
				}
				else {
					console.error("Error creating message!");
				}
			})			
			.catch(err => console.error("Error creating message", err));;
		}
	});

	client.on('rooms', payload => {
		if(payload.action === 'create') {
			app.get('db').createRoom(payload.room.name)
			.then(room => {
				console.log("Created new room", room);
				if(room) {
					io.emit('rooms', { action: 'create', room: room });
				}
				else {
					console.error("Error creating room!");
				}	
			})
			.catch(err => console.error("Error creating room", err));
		}
	});
});