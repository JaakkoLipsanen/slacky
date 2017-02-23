import Vue from 'vue';
import Vuex from 'vuex';

import MessageClient from '../misc/message-client';
import api from '../api';

Vue.use(Vuex);

const state = {
	rooms: [],
	currentRoom: null,
	user: null,

	isConnected: false, // todo: message client has isConnected() method actually which could (and does) provide more accurate info, use it?
	messageClient: null,
};

const mutations = {
	changeRoom(state, newRoom) {
		state.currentRoom = newRoom;
	},

	addReceivedMessage(state, payload) {
		const room = state.rooms.find(room => room.name === payload.room);
		if(!room) {
			console.error("Message received, but rooms was not found: " + payload.room + ": " + payload.message);
			return;
		}

		room.messages.push(payload.message);
	},

	initializeState(state, data) {
		state.user = data.user;
		state.rooms = data.rooms;
		state.isConnected = true;

		if(state.rooms.length > 0) {
			state.currentRoom = state.rooms[0];
		}
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

const actions = {
	sendMessage: (context, message) => {
		return new Promise((resolve, reject) => {

			// todo: the sender should not be sent, it should be determined on the server!
			context.state.messageClient.sendMessage({ sender: context.state.user, room: context.state.currentRoom.name, text: message });
			resolve(); // TODO!!! never reject atm. I dont know.. should it be checked whether it's actually sent or something?
		});
	},

	openConnection(context) {
		return new Promise((resolve, reject) => {

			console.log(context);
			MessageClient.openConnection()
			.then(response => {
				context.commit('initializeState', response.initialData);

				context.state.messageClient = response.messageClient;
				context.state.messageClient.addMessageReceivedListener((room, message) => context.commit('addReceivedMessage', { room: room, message: message}));
				resolve();
			})
			.catch(err => reject(err));
		});
	},
};

export default new Vuex.Store({
	state, 
	mutations,
	actions
});