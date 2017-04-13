const crypto = require('../../misc/crypto');

module.exports = function(sequelize, DataTypes) {

	const User = sequelize.define('user', {	
		username: { 
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isLengthValid: sequelize.validateLength("Username", 4, 15)
			} 
		},

		password_hash: { type: DataTypes.STRING, allowNull: false },// todo: validate pw length as well
		profilePic: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } }, // url
	});
	
	// todo: try catch or no?
	User.createAndHashPassword = async (credientials) => {	
		const hash = await crypto.hash(credientials.password);
		return User.create({ username: credientials.username, password_hash: hash });	
	};

	User.Instance.prototype.passwordMatches = async function(plainTextPassword) {
		return await crypto.compare(this.password_hash, plainTextPassword);
	};

	User._associate = (models) => { };
	User._name = "User";
	return User;
};