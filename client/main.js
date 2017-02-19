import Vue from 'vue'

import Root from './root.vue';
import store from './stores/store';

new Vue({
	store,
	el: '#app',
	render: h =>  h(Root),

	data: function() { 
		return { currentView: 'Login' } 
	},

	methods: {
		moveToApp: function() { this.currentView = 'App'; }
	},

	components: {
		Root,
	}
});
