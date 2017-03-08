const socketio = require('socket.io');
const db = require('./database');

// TODO: A: refactor this to have only depth of 1 and B: could these checks be done on db-level?
const createMessage = (io, roomName, sender, messageText) => {
	db.Room.findOne({
		where: { name: roomName }
	})
	.then(room => {
		if(!room) {
			return reject({ type: 'arguments', message: "Trying to create message but room doesn't exist" });
		}

		db.User.findOne({
			where: { username: sender.username }
		})
		.then(user => {
			if(!user) {
				return reject({ type: 'arguments', message: "Trying to create message but user doesn't exist" });
			}

			db.Message.create({ roomId: room.dataValues.id, senderId: user.dataValues.id, text: messageText })
			.then(createdMessage => { 
				io.emit('messages', { 
					action: 'create', 
					room: roomName, 
					sender: sender, 
					timestamp: createdMessage.timestamp, 
					message: messageText 
				}); 
			})
			.catch(err => { 
				io.emit('messages', { action: 'error', message: "Error in creating new message" });
				console.error("Error in creating message", err);
			});
		})
	})
	.catch(err => console.error(err));
};

const createRoom = (io, roomName) => {
	db.Room.create({ name: roomName })
	.then(created => { 
		created.dataValues.messages = []; // .messages isn't automatically included :/
		io.emit('rooms', { action: 'create', room: created });
	})
	.catch(err => {
		io.emit('rooms', { action: 'error', message: `Error creating room ${roomName}` });
		console.error(`Error creating room ${roomName}`, err);
	});
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
			client.on('messages', payload => {
				if(payload.action === 'create') createMessage(io, payload.room,  payload.sender, payload.message);
			//	if(payload.action === 'delete') ?
			});

			client.on('rooms', payload => {
				if(payload.action === 'create') createRoom(io, payload.room.name);
			//  if(payload.action === 'delete')
			//  if(paylaod.action === 'edit)
			});
		});
	}
}
