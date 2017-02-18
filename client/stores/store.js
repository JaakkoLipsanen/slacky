import Vue from 'vue';
import Vuex from 'vuex';

import { users, rooms, createMessage } from './placeholder-data';

Vue.use(Vuex);

const DefaultUser = users.Pekka;
const state = {
	rooms: rooms,

	auth: { isAuthenticated: true, user: DefaultUser },
	currentRoom: rooms[0]
};

const mutations = {
	sendMessage: (state, message) => {
		return state.currentRoom.messages.push(createMessage(DefaultUser, message));
	},

	changeRoom: (state, newRoom) => {
		state.currentRoom = newRoom;
	}
};

export default new Vuex.Store({
	state, 
	mutations
});