/* placehodler for actual database */

const users = [
	{ username: 'flai', password: 'konala' },
	{ username: 'puupaa', password: 'muumipeikko'},
];

module.exports = {
	users: users,
	findUser: function(username) {
		const user = this.users.find(u => u.username === username);

		// Object.assign creates a shallow copy
		return user ? Object.assign({}, user) : undefined;
	},

	createUser: function(username, password) {
		const user = { username: username, password: password };
		this.users.push(user);

		console.log("New user created: " + username);
		return user;
	}
};