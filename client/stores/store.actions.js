import ChatClient from '../misc/chat-client';

export default {
	sendMessage(context, message) {
		return new Promise((resolve, reject) => {

			// todo: the sender should not be sent, it should be determined on the server!
			context.state.chatClient.sendMessage({ room: context.state.currentRoom.name, message: { sender: context.state.user, text: message } } );
			resolve(); // TODO!!! never reject atm. I dont know.. should it be checked whether it's actually sent or something?
		});
	},

	openConnection(context) {
		return new Promise((resolve, reject) => {

			ChatClient.openConnection()
			.then(payload => {
				context.commit('initializeState', payload);
				resolve();
			})
			.catch(err => reject(err));
		});
	},

	createNewRoom(context, roomName) {
		return new Promise((resolve, reject) => {
			context.state.chatClient.createRoom(roomName);
			resolve(); // ...
		});
	}
};