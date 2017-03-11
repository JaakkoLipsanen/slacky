const crypto = require('./misc/crypto');

const Sequelize = require('sequelize');
const sequelizeConfig = {
	dialect: 'postgres',
	logging: false,

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
};

const sequelize = process.env.DATABASE_URL ? 
	new Sequelize(process.env.DATABASE_URL, sequelizeConfig) :
	new Sequelize('slacky', 'flai', 'konala', sequelizeConfig); // todo: put in env variables

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

	// TODO: OKAY bcrypt package actually saves hashed = salt + hash(password + salt)
	// so password_salt doesnt have to be saved to db. just use bcrypt.compare() funcs
	password_salt: { type: Sequelize.STRING, allowNull: false },
	password_hash: { type: Sequelize.STRING, allowNull: false }, // password could be of type "VIRTUAL" with set(val) defined // todo: validate pw length as well
	profilePic: { type: Sequelize.STRING, allowNull: true, validate: { isUrl: true } }, // url
});

// todo: refactor and move to own folder
User.Instance.prototype.passwordMatches = async function(plainTextPassword) {
	const hash = await crypto.hash(plainTextPassword, this.password_salt);
	return this.password_hash === hash;
};

// todo: try catch or no?
User.createAndHashPassword = async (credientials) => {
	const salt = await crypto.generateSalt();		
	const hash = await crypto.hash(credientials.password, salt);

	return User.create({ username: credientials.username, password_hash: hash, password_salt: salt });	
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