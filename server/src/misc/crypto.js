const bcrypt = require('bcrypt');
const SaltRounds = 8; // 10 would be better but since I check password as user types, faster == better

module.exports = {
	hash(password) {
		return bcrypt.hash(password, SaltRounds); // auto  generates salt
	},

	compare(hash, plaintextPassword) {
		return bcrypt.compare(plaintextPassword, hash);
	}
};