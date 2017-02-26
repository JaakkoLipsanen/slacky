<template>
	<transition name="fade" mode="out-in" @after-leave="afterTransitionLeave">
		<component :is="currentView"></component>
	</transition>
</template>

<script>
import App from './app.vue'
import Login from './login.vue'
import api from './api';

export default {
	name: 'router',
	components: {
		App, 
		Login
	},

	data() { 
		return { 
			currentView: '', 
			pageParams: { }, 
			_transitionEndedCallback: null // mehhhh... read why below in redirect(..)
		} 
	},

	beforeCreate() {
		// if the client is not logged in, then display login screen
		api.getCurrentUser()
		.then(user => this.currentView = user ? 'App' : 'Login')
		.catch(err => { console.error("Error on finding if user is logged in"); this.currentView = "Login"; });
	},

	methods: {
		afterTransitionLeave() { 
			if(this._transitionEndedCallback) {
				this._transitionEndedCallback();
			}
		},

		redirect(page, params = { }) {
			return new Promise((resolve, reject) => {
				this.pageParams = params;
				this.currentView = page;

				// mehhhh... I don't know how this should be done. I cant do $(anim).one('after-leave', ...)
				// because it doesn't seem to work with <transition> and whatnot :/
				this._transitionEndedCallback = () => {
					resolve();
					this._transitionEndedCallback = null;
				};

				// reject() is never called. Is it even possible for the transition to fail?
			});
		}
	}
}
</script>

<style lang='scss' scoped>

$fade-length: 0.25s;
.fade-enter-active, .fade-leave-active {
	transition: opacity $fade-length ease;
}
.fade-enter, .fade-leave-to, .component-fade-leave-active {
	opacity: 0;
}

/* apply to all elements */
html * {
	font-family: 'Lato';
}

</style>
