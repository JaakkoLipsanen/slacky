const Sequelize = require('sequelize');
const sequelize = new Sequelize('slacky', 'jaakko', 'konala', {
	host: 'localhost',
	dialect: 'postgres', // use one of these

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
});

sequelize.authenticate()
.then(function(err) {
	console.log('Connection has been established successfully.');
})
.catch(function (err) {
	console.log('Unable to connect to the database:', err);
});

const User = sequelize.define('user', {
	username: { type: Sequelize.STRING },
	password: { type: Sequelize.STRING },
	profilePic: { type: Sequelize.STRING }, // url
});

const Room = sequelize.define('rooms', {
	name: { type: Sequelize.STRING }
});

const Message = sequelize.define('messages', {
	text: { type: Sequelize.STRING },
	timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },


	/* sender_id: {
		type: Sequelize.INTEGER,
		references: {
			model: "Users",
			key: "id"
		}
	},

	room_id: {
		type: Sequelize.INTEGER,
		references: {
			model: "Rooms",
			key: "id"
		}
	}  */
});


// force: true will drop the table if it already exists
User.sync({force: true}).then(() => {
	// Table created
	User.create({
		username: 'flai',
		password: 'konala'
	});

	User.create({
		username: 'puupaa',
		password: 'muumipeikko'
	});
});


Room.hasMany(Message);
// force: true will drop the table if it already exists
Room.sync({force: true}).then(() => {
	// Table created
	Room.create({
		name: 'general',
	});

	Room.create({
		name: 'coding',
	});

	// Room.hasMany(Message);
	Message.belongsTo(Room);
	Message.belongsTo(User); 
	Message.sync({force: true});
});


module.exports = {
	getRooms() {
		return new Promise((resolve, reject) => {
			Room.findAll({ include: [Message] })
			.then(rooms => { resolve(rooms); return null; })
			.catch(reject);
		});
	},

	findUser(username, password) {
		return User.findOne({
			where: { username: username },
			attributes: ['username', 'profilePic'].concat(password ? ['password'] : [])
		});
	},

	createUser(username, password) {
		return new Promise((resolve, reject) => {

			const MinUsernameLength = 4;
			const MinPasswordLength = 6;
			if(username.length < MinUsernameLength || password.length < MinPasswordLength) {
				reject({ type: 'arguments', message: "Invalid username or password" });
				return;
			}
			
			return User.findOne({where: { username: username }})
			.then(user => {
				if(user) {
					reject({ type: 'duplicate', message: 'User with same username exists' });
					return null;
				}

				return user;
			})
			.then(user =>
				User.create( { username: username, password: password})
				.then(user => resolve(user))
				.catch(err => reject(err));
			})
			.catch(err => reject(err));
		});
	},

	createMessage(roomName, sender, message) {
		return new Promise((resolve, reject) => {
			Room.findOne({ where: { name: roomName }})
			.then(room => {
				if(!room) {
					reject({ type: 'arguments', message: "Trying to create message but room doesn't exist" });
					return;
				}

				Message.create({ room_id: room.id, sender_id: sender.id, text: message })
				.then(message => resolve(message))
				.catch(err => reject(err));
			})
		});
	},

	createRoom(room) {	
		return new Promise((resolve, reject) => {
			Room.findOne({ where: { name: room.name } })
			.then(room => {
				if(room) {
					reject({ type: 'duplicate', message: "Trying to create duplicate room" });
					return;
				}

				Room.create({ name: room.name })
				.then(room => resolve(room))
				.catch(err => reject(err));
			})
			.catch(err => reject(err));
		});
	}
};