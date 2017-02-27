import Vue from 'vue'

import Router from './router.vue';
import store from './stores/store';

new Vue({
	store,
	el: '#root',
	render: h =>  h(Router),

	components: {
		Router,
	}
});
