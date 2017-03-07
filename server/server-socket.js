const socketio = require('socket.io');
const $db = require('./database');

const onMessageReceived = (io, payload) => {
	if(payload.action === 'create') {
		$db.createMessage(payload.room, payload.sender, payload.message)
		.then(message => {			
			if(message) {
				io.emit('messages', { action: 'create', room: payload.room, sender: payload.sender, timestamp: message.timestamp, message: payload.message }); // TODO: don't use payload, but message. (??????)
			}
			else {
				io.emit('messages', { action: 'error', message: "Error in creating new message" });
				console.error("Error creating message!");
			}
		})			
		.catch(err => console.error("Error creating message", err));
	}
};

const onRoomMessageReceived = (io, payload) => {
	if(payload.action === 'create') {
		$db.createRoom(payload.room.name)
		.then(room => {
			if(room) {
				console.log("Created new room", room);
				io.emit('rooms', { action: 'create', room: room });
			}
			else {
				io.emit('rooms', { action: 'error', message: "Error in creating new room" });
				console.error("Error creating room!");
			}	
		})
		.catch(err => console.error("Error creating room", err));
	}
};

module.exports = {
	setup(app) {

		const io = socketio(app.server);
		io.use((client, next) => {
			// todo: there is no authentication atm for web sockets, so technically
			// some non-authenticated user could create web socket connection and start posting.
			// not a huge problem at least atm, but I think authentication could be put here?
			next();
		}).on('connection', client => { // TODO: atm one client can have multiple connections here... limit to 1 per user
			client.on('messages', payload => onMessageReceived(io, payload));
			client.on('rooms', payload => onRoomMessageReceived(io, payload));
		});
	}
}
