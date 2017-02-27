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

	findRoom(roomName) {	
		return this.rooms.find(room => room.name === roomName);
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

	createMessage(roomName, message) {
		const room = this.findRoom(roomName);
		if(!room) {
			console.error("Message received, but room was not found: " + roomName + ": " + message.text);
			return null;
		}
		
		message.timestamp = new Date();
		room.messages.push(message);

		return message;
	},

	createRoom(room) {
		if(this.findRoom(room.name)) {
			console.error("Trying to create a duplicate room");
			return;
		}

		room = { name: room.name, messages: [] };
		this.rooms.push(room);
		return room;
	}
};