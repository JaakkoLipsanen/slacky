import Vue from 'vue';
import Vuex from 'vuex';

import api from '../api';
import identicon from '../misc/identicon';
import { users, rooms, createMessage } from './placeholder-data';

Vue.use(Vuex);

const DefaultUser = users.Pekka;
const state = {
	rooms: rooms,

	user: null,
	currentRoom: rooms[0]
};

const mutations = {
	sendMessage: (state, message) => {
		return state.currentRoom.messages.push(createMessage(state.user, message));
	},

	changeRoom: (state, newRoom) => {
		state.currentRoom = newRoom;
	},

	notifyLoggedIn: (state, user) => {
		// meh, not good. What I should do is that when .profilePic is called, it is generated (also options for resolution?)
		if(!user.profilePic) {
			user.profilePic = identicon.generateToDataURL(40, 40, user.username);
		}

		state.user = user;
	}
};

const actions = {
	// todo: login and register are right now identical client-side save for the url, combine
	login(context, userCredentials) {	
		return new Promise((resolve, reject) => {

			api.login(userCredentials)
			.then(user => {
				context.commit('notifyLoggedIn', user);
				resolve(user);
			})
			.catch(err => reject(err));
		});
	},

	register(context, userCredentials) {
		return new Promise((resolve, reject) => {

			api.register(userCredentials)
			.then(user => {
				context.commit('notifyLoggedIn', user);
				resolve(user);
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