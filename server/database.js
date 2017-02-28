const Sequelize = require('sequelize');
const Pool = pg.Pool;

/*
const users = [
	{ username: 'flai', password: 'konala' },
	{ username: 'puupaa', password: 'muumipeikko'},
];

const rooms = [
	{ name: "general", messages: [] },
	{ name: "coding", messages: [] }
]; */

const config = {
	host: 'localhost',
	user: 'jaakko',
	password: 'konala',
	database: 'slacky'
};

const pool = new Pool(config);
const db = {

	query(text, values) {
		return new Promise((resolve, reject) => {
			pool.query(text, values, (err, result) => {
				if(err) {
					reject(err);
					return;
				}

				resolve(result);
			});
    	});
	},
};

const User = {
	find(username) {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM Users WHERE username = $1', [username])
			.then(response => { console.log(response); resolve(response.rows[0]) })
			.catch(err => reject(err));
		});
	},

	create(username, password) {
		return new Promise((resolve, reject) => {
			db.query('INSERT INTO Users (username, password) VALUES ($1, $2);', [username, password])
			.then(response => resolve(response.rows.first))
			.catch(err => reject(err));
		});
	}
};

const Room = {
	find(roomName) {
		return new Promise((resolve, reject) => {
			this.query('SELECT * FROM Rooms WHERE name = $1', [roomName])
			.then(response => resolve(response.rows[0]))
			.catch(err => reject(err));
		});
	},
	
	create(roomName) {
		return new Promise((resolve, reject) => {
			db.query('INSERT INTO Rooms (name) VALUES ($1);', [roomName])
			.then(response => resolve(response.rows.first))
			.catch(err => reject(err));
		});
	},

	all() {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM Rooms r, Messages m WHERE m.room_id = m.id')
			.then(response => {
				const rooms = response.rows;
				resolve(response.rows))
			.catch(err => reject(err));
		});
	}
};

const Message = {
	/* find(roomName) {
		return new Promise((resolve, reject) => {
			this.query('SELECT * FROM Rooms WHERE name = $1', [roomName])
			.then(response => resolve(response.rows.first))
			.catch(err => reject(err));
		});
	} */
	
	create(roomId, senderId, text) {
		return new Promise((resolve, reject) => {
			db.query('INSERT INTO Messages (room_id, sender_id, text) VALUES ($1, $2, $3);', [roomId, senderId, text])
			.then(response => resolve(response.rows.first))
			.catch(err => reject(err));
		});
	}
};

module.exports = {
	getRooms() {
		return new Promise((resolve, reject) => {
			Room.all()
			.then(rooms => resolve(rooms))
			.catch(err => reject(err));
		});
	},

	findUser(username) {
		return User.find(username);
	},

	createUser(username, password) {
		return new Promise((resolve, reject) => {

			const MinUsernameLength = 4;
			const MinPasswordLength = 6;
			if(username.length < MinUsernameLength || password.length < MinPasswordLength) {
				reject({ type: 'arguments', message: "Invalid username or password" });
				return;
			}
			
			User.find(username)
			.then(user => {
				if(user) {
					reject({ type: 'duplicate', message: 'User with same username exists' });
					return;
				}

				User.create(username, password)
				.then(() => resolve())
				.catch(err => reject(err));
			})
			.catch(err => reject(err));
		});
	},

	createMessage(roomName, message) {
		Room.find(roomName)
		.then(room => {
			if(!room) {
				reject({ type: 'arguments', message: "Trying to create message but room doesn't exist" });
				return;
			}

			Message.create
		})
		const room = this.findRoom(roomName);
		if(!room) {
			console.error("Message received, but room was not found: " + roomName + ": " + message.text);
			return null;
		}
		
		message.timestamp = new Date();
		room.messages.push(message);

		return message;
	},

	createRoom(room) {
		Room.find(room.name)
		.then(room => {
			if(room) {
				reject({ type: 'duplicate', message: "Trying to create duplicate room" });
				return;
			}

			Room.create(room.name)
			.then(() => resolve())
			.catch(err => reject(err));
		})
		.catch(err => reject(err));
	}
};