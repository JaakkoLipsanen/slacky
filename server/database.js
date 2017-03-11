const crypto = require('./misc/crypto');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

// TODO: move all models to their own files
const User = sequelize.define('user', {
	username: { 
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isLengthValid: validateLength("Username", 4, 15)
		} 
	},

	password_hash: { type: Sequelize.STRING, allowNull: false },// todo: validate pw length as well
	profilePic: { type: Sequelize.STRING, allowNull: true, validate: { isUrl: true } }, // url
});

// todo: refactor and move to own folder
User.Instance.prototype.passwordMatches = async function(plainTextPassword) {
	return await crypto.compare(this.password_hash, plainTextPassword);
};

// todo: try catch or no?
User.createAndHashPassword = async (credientials) => {	
	const hash = await crypto.hash(credientials.password);
	return User.create({ username: credientials.username, password_hash: hash });	
};

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
sequelize.sync({ force: false });

module.exports = {
	User,
	Room,
	Message,
};