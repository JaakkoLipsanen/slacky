import Vue from 'vue';
import Vuex from 'vuex';

import api from '../api';
import identicon from '../misc/identicon';

Vue.use(Vuex);

const state = {
	rooms: [],
	currentRoom: null,
	user: null,

	isInitialized: false,
	sendMessageFunc: null, // meh.. don't really like this. but yeah, holds a function that sends message via sockets
};

const mutations = {
	changeRoom: (state, newRoom) => {
		state.currentRoom = newRoom;
	},

	notifyLoggedIn: (state, user) => {
		// meh, not good. What I should do is that when .profilePic is called, it is generated (also options for resolution?)
		if(!user.profilePic) {
			user.profilePic = identicon.generateToDataURL(40, 40, user.username);
		}

		state.user = user;
	},

	initializeData: (state, data) => {
		state.rooms = data.rooms;
		state.sendMessageFunc = data.sendMessageFunc;

		if(state.rooms.length > 0) {
			state.currentRoom = state.rooms[0];
		}

		state.isInitialized = true;
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

	sendMessage: (context, message) => {
		return new Promise((resolve, reject) => {

			context.state.sendMessageFunc({ sender: context.state.user, room: context.state.currentRoom.name, text: message });
			resolve(); // TODO!!! never reject atm. I dont know.. should it be checked whether it's actually sent or something?
		});
	},

	establishConnection(context) {
		return new Promise((resolve, reject) => {
			
			const onNewMessage = message => {
				const room = context.state.rooms.find(room => room.name === message.room);
				if(!room) {
					console.error("Message received, but rooms was not found: " + message.room + ": " + message.text);
					return;
				}

				room.messages.push({ sender: message.sender, text: message.text, timestamp: message.timestamp });
			};

			api.establishConnection(onNewMessage)
			.then(data => context.commit('initializeData', data))
			.catch(err => reject(err));
		});
	}
};

export default new Vuex.Store({
	state, 
	mutations,
	actions
});