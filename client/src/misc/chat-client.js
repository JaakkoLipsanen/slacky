import api from '../api';
import config from '../config';

// TODO: ChatStore? as a child store to the main one?
export default class ChatClient {

	constructor(socket, data) {
		this.socket = socket;
		this.isConnected = true;

		this.rooms = data.rooms; // TODO: move this to store somehow :/ ?
	//	this.users = [] ?

		socket.on('messages', payload => this._onMessageReceived(payload));
		socket.on('rooms', payload => this._onRoomMessageReceived(payload));
	}

	sendMessage(payload) {
		if(!this._ensureIsConnected()) {
			return;
		}

		this.socket.emit('messages', { action: 'create', room: payload.room, sender: payload.sender, message: payload.message });
	}

	createRoom(roomName) {
		if(!this._ensureIsConnected()) {
			return;
		}

		this.socket.emit('rooms', { action: 'create', room: { name: roomName } });
	}

	disconnect() {
		if(!this.isConnected) {
			console.log("Disconnecting even though already disconnected");
		}

		// todo: calling this ensures that one user can't be connected to server
		// on multiple web sockets. however, this might not always be called (?)
		// so the check should definitely be done server-side too
		this.socket.disconnect();
	}

	isConnected() {
		return this.isConnected;
	}

	_ensureIsConnected() {
		if(!this.isConnected) {
			console.error("Trying to use ChatClient but client is not connected");
			return false;
		}

		return true;
	}

	_onMessageReceived(payload) {
		if(payload.action !== 'create') {
			return;
		}

		const room = this.rooms.find(room => room.name === payload.room);
		if(!room) {
			console.error("Message received, but room was not found", payload.room, payload.message);
			return;
		}

		room.messages.push({ text: payload.message, sender: payload.sender, timestamp: payload.timestamp });
	}

	_onRoomMessageReceived(payload) {
		if(payload.action === 'create') {
			this.rooms.push(payload.room);
		}
	//	else if(payload.action === 'delete') // todo?
	}

	static openConnection() {
		return new Promise((resolve, reject) => {

			api.openConnection()
			.then(response => {

				const socket = io.connect(config.SERVER_URL);
				const client = new ChatClient(socket, { rooms: response.data.rooms });

				socket.on('connect_error', err => reject(err));
				socket.on('connect', () => {
					resolve({ chatClient: client, user: response.data.user });
				});
			})
			.catch(err => reject(err));
		});
	}
};
