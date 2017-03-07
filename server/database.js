const Sequelize = require('sequelize');
const sequelize = new Sequelize('slacky', 'flai', 'konala', {
	host: 'localhost',
	dialect: 'postgres',
	logging: false,

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
});

// this is not really needed
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
});

Room.hasMany(Message);
Message.belongsTo(User, { as: 'sender' });

// force: true will drop the table if it already exists
User.sync({force: false}).then(() => {
	/* */
});

// force: true will drop the table if it already exists
Room.sync({force: false}).then(() => {
/*	Room.create({ name: 'general' });
	Room.create({ name: 'coding' }); */
	
	Message.sync({force: false});
});

module.exports = {
	getRooms() {
		return new Promise((resolve, reject) => {
			Room.findAll({ 
				include: [
				{ model: Message, include: [
					{ model: User, as: 'sender' }] }] })
			.then(rooms => { resolve(rooms); return null; })
			.catch(reject);
		});
	},

	findUser(username, password) {		
		return new Promise((resolve, reject) => {
			User.findOne({
				where: { username: username },
				attributes: ['username', 'profilePic'].concat(password ? ['password'] : [])
			})
			.then(user => { resolve(user); return null; })
			.catch(err => reject(err));
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
			
			User.findOne({where: { username: username }})
			.then(user => {
				if(user) {
					reject({ type: 'duplicate', message: 'User with same username exists' });
					return null;
				}

				return user;
			})
			.then(user => { 
				User.create( { username: username, password: password})
				.then(created => {
					resolve(created);
					return created;
				})
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

				User.findOne({ where: { username: sender.username }})
				.then(user => {
					if(!user) {
						reject({ type: 'arguments', message: "Trying to create message but user doesn't exist" });
						return;
					}

					Message.create({ roomId: room.dataValues.id, senderId: user.dataValues.id, text: message })
					.then(message => resolve(message))
					.catch(err => reject(err));
				});
			})
		});
	},

	createRoom(roomName) {	
		return new Promise((resolve, reject) => {
			Room.findOne({ where: { name: roomName } })
			.then(room => {
				if(room) {
					reject({ type: 'duplicate', message: "Trying to create duplicate room" });
					return;
				}

				Room.create({ name: roomName})
				.then(created => { created.dataValues.messages = []; resolve(created); return created; })
				.catch(err => reject(err));
			})
			.catch(err => reject(err));
		});
	}
};