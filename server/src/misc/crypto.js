const bcrypt = require('bcrypt');
const SaltRounds = 9;

module.exports = {
	hash(password) {
		return bcrypt.hash(password, SaltRounds); // auto  generates salt
	},

	compare(hash, plaintextPassword) {
		return bcrypt.compare(plaintextPassword, hash);
	}
};