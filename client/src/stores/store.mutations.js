export default {
	changeRoom(state, newRoom) {
		state.currentRoom = newRoom;
	},

	addReceivedMessage(state, payload) {
		const room = state.rooms.find(room => room.name === payload.room);
		if(!room) {
			console.error("Message received, but room was not found:", + payload);
			return;
		}

		room.messages.push(payload.message);
	},

	initializeState(state, payload) {
		state.user = payload.user;
		state.chatClient = payload.chatClient;
		state.isConnected = true;

		if(state.chatClient.rooms.length > 0) {
			state.currentRoom = state.chatClient.rooms[0];
		}
	},

	resetState(state) {
		state.currentRoom = null;
		state.user = null;
		state.isConnected = false;

		if(state.chatClient != null) {
			state.chatClient.disconnect();
			state.chatClient = null;
		}
	}
};