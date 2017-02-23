import api from '../api';

export default class MessageClient {

	constructor(socket) {
		this.socket = socket;
		this.isConnected = true;
		this.messageReceivedListeners = [];

		socket.on('messages', message => {
			for(const listener of this.messageReceivedListeners) {
				listener(message.room, { sender: message.sender, text: message.text, timestamp: message.timestamp });
			}
		});
	}

	sendMessage(message) {
		if(!this.isConnected) {
			console.error("Trying to send message but socket is not connected");
			return;
		}

		this.socket.emit('messages', message);
	}

	addMessageReceivedListener(listener) {
		this.messageReceivedListeners.push(listener);
	}

	disconnect() {
		if(!this.isConnected) {
			console.log("Disconnecting even though already disconnected");
		}

		this.socket.disconnect();
	}

	isConnected() {
		return this.isConnected;
	}

	static openConnection() {
		return new Promise((resolve, reject) => {

			api.openConnection()
			.then(response => {

				const socket = io.connect();
				socket.on('connect_error', err => reject(err));
				socket.on('connect', () => { 
					resolve({ initialData: { rooms: response.data.rooms, user: response.data.user }, messageClient: new MessageClient(socket) });
				});
			}) 
			.catch(err => reject(err));
		});
	}	
};