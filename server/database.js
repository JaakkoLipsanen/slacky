/* placehodler for actual database */

const users = [
	{ username: 'flai', password: 'konala' },
	{ username: 'puupaa', password: 'muumipeikko'},
];

module.exports = {
	users: users,
	findUser: function(username) {
		return this.users.find(u => u.username == username);
	}
};