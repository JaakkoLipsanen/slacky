/* placehodler for actual database */

const users = [
	{ username: 'flai', password: 'konala' },
	{ username: 'puupaa', password: 'muumipeikko'},
];

const rooms = [
	{ name: "general", messages: [] },
	{ name: "coding", messages: [] }
];

module.exports = {
	users: users,
	rooms: rooms,

	// todo: this should probably return user without password. create separate function for checking password
	findUser(username) {
		const user = this.users.find(u => u.username === username);

		// Object.assign creates a shallow copy
		return user ? Object.assign({}, user) : undefined;
	},

	createUser(username, password) {
		const MinPasswordLength = 6;
		if(password.length < MinPasswordLength) return null;
		if(this.findUser(username)) return null;

		const user = { username: username, password: password };
		this.users.push(user);

		console.log("New user created: " + username);
		return user;
	},

	createMessage(message) {
		const room = this.rooms.find(room => room.name === message.room);
		if(!room) {
			console.error("Message received, but room was not found: " + message.room + ": " + message.text);
			return null;
		}
		
		message.timestamp = new Date();
		room.messages.push(message);

		return message;
	}
};