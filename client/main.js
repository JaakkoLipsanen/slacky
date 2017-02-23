import Vue from 'vue'

import Root from './root.vue';
import store from './stores/store';

new Vue({
	store,
	el: '#root',
	render: h =>  h(Root),

	data: function() { 
		return { currentView: 'App', pageParams: { } } 
	},

	methods: {
		redirect: function(page, params = { }) { this.pageParams = params; this.currentView = page; }
	},

	components: {
		Root,
	}
});
