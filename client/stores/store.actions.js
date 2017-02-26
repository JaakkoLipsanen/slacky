import MessageClient from '../misc/message-client';

export default {
	sendMessage(context, message) {
		return new Promise((resolve, reject) => {

			// todo: the sender should not be sent, it should be determined on the server!
			context.state.messageClient.sendMessage({ sender: context.state.user, room: context.state.currentRoom.name, text: message });
			resolve(); // TODO!!! never reject atm. I dont know.. should it be checked whether it's actually sent or something?
		});
	},

	openConnection(context) {
		return new Promise((resolve, reject) => {

			MessageClient.openConnection()
			.then(response => {
				context.commit('initializeState', { messageClient: response.messageClient, initialData: response.initialData });
				context.state.messageClient.addMessageReceivedListener((room, message) => context.commit('addReceivedMessage', { room: room, message: message}) );
				resolve();
			})
			.catch(err => reject(err));
		});
	},
};