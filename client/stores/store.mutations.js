export default {
	changeRoom(state, newRoom) {
		state.currentRoom = newRoom;
	},

	addReceivedMessage(state, payload) {
		const room = state.rooms.find(room => room.name === payload.room);
		if(!room) {
			console.error("Message received, but room was not found: " + payload.room + ": " + payload.message);
			return;
		}

		room.messages.push(payload.message);
	},

	initializeState(state, payload) {
		state.user = payload.initialData.user;
		state.rooms = payload.initialData.rooms;

		if(state.rooms.length > 0) {
			state.currentRoom = state.rooms[0];
		}

		state.messageClient = payload.messageClient;
		state.isConnected = true;
	},

	resetState(state) {
		state.rooms = [];
		state.currentRoom = null;
		state.user = null;
		state.isConnected = false;

		if(state.messageClient != null) {
			state.messageClient.disconnect();
			state.messageClient = null;
		}
	}
};