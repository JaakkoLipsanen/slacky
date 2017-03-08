const Sequelize = require('sequelize');
const sequelize = new Sequelize('slacky', 'flai', 'konala', { // TODO: CHANGE THESE ALL TO USE ENV VARIABLES
	host: 'localhost',
	dialect: 'postgres',
	logging: false,

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
});

const validateLength = (name, min, max) => (val) => {
	if(val.length < min || val.length > max) 
		throw new Error(`${name} is too short or too long!`);
};

const User = sequelize.define('user', {
	username: { 
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isLengthValid: validateLength("Username", 4, 15)
		} 
	},

//  password_hash // TODO
	password: { type: Sequelize.STRING }, // password could be of type "VIRTUAL" with set(val) defined // todo: validate pw length as well
	profilePic: { type: Sequelize.STRING, allowNull: true, validate: { isUrl: true } }, // url
});

const Room = sequelize.define('rooms', {
	name: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isLengthValid: validateLength("Room name", 3, 10) } }
});

const Message = sequelize.define('messages', {
	text: { type: Sequelize.STRING },
	timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

Room.hasMany(Message);
Message.belongsTo(User, { as: 'sender' });

// syncs the tables to the db. force: false doesn't drop the table if it exists
User.sync({ force: false });
Room.sync({ force: false });
Message.sync({ force: false });

module.exports = {
	User,
	Room,
	Message,
};