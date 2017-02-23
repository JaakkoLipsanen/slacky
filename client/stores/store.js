import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api';

Vue.use(Vuex);

const state = {
	rooms: [],
	currentRoom: null,
	user: null,

	isInitialized: false,
	sendMessageFunc: null, // remove this from state and put it outside (above) as a 'global'? // meh.. don't really like this. but yeah, holds a function that sends message via sockets
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
		state.sendMessageFunc = data.sendMessageFunc;

		if(state.rooms.length > 0) {
			state.currentRoom = state.rooms[0];
		}

		state.isInitialized = true;
	},

	resetState(state) {
		state.rooms = [];
		state.currentRoom = null;
		state.user = null;

		state.isInitialized = false;
	}
};

const actions = {

	sendMessage: (context, message) => {
		return new Promise((resolve, reject) => {

			context.state.sendMessageFunc({ sender: context.state.user, room: context.state.currentRoom.name, text: message });
			resolve(); // TODO!!! never reject atm. I dont know.. should it be checked whether it's actually sent or something?
		});
	},

	establishConnection(context) {
		return new Promise((resolve, reject) => {
			
			const onMessageReceived = message => {
				context.commit('addReceivedMessage', { room: message.room, message: { sender: message.sender, text: message.text, timestamp: message.timestamp }});
			};

			api.establishConnection(onMessageReceived)
			.then(initialData => { context.commit('initializeState', initialData); resolve(); })
			.catch(err => reject(err));
		});
	},
};

export default new Vuex.Store({
	state, 
	mutations,
	actions
});