import ChatClient from '../misc/chat-client';

export default {
	async sendMessage(context, message) {
		// todo: the sender should not be sent, it should be determined on the server!
		context.state.chatClient.sendMessage({ room: context.state.currentRoom.name, sender: context.state.user, message: message });

		// todo: await to make sure the message was sent succesfully?
	},

	async openConnection(context) {
		if(context.state.isConnected) {
			return { success: true }; // or false :/ ?
		}

		const result = await ChatClient.openConnection();
		if(result.success) {
			context.commit('initializeState', result.payload);
		}

		return result;
	},

	async createNewRoom(context, roomName) {
		context.state.chatClient.createRoom(roomName);
		// todo: await to make sure room was created succesfully?
	}
};