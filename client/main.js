import Vue from 'vue'

import Router from './router.vue';
import store from './stores/store';

// defines this.$router in all vue components.. kinda hacky, maybe separate router into own class?
Vue.mixin({ 
	beforeCreate() { 
		// "this" is in this context the vue element being created
		this.$router = this.$root.$children[0];
	}
});

new Vue({
	store,
	el: '#root',
	render: h =>  h(Router),

	components: {
		Router,
	}
});
