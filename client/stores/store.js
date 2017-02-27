import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './store.mutations';
import actions from './store.actions';

Vue.use(Vuex);

const state = {
	currentRoom: null,
	user: null,

	isConnected: false, // todo: message client has isConnected() method actually which could (and does) provide more accurate info, use it?
	chatClient: null,
};

export default new Vuex.Store({
	state, 
	mutations,
	actions
});