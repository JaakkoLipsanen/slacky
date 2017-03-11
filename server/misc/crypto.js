const bcrypt = require('bcrypt');
const SaltRounds = 8; // 10 would be better but since I check password as user types, faster == better

module.exports = {
	generateSalt() { // async
		return bcrypt.genSalt(SaltRounds);
	},

	hash(password, salt) {
		return bcrypt.hash(password, salt);
	},
};