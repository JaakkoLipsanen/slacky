<template>
	<transition name="fade" mode="out-in" v-on:after-leave="afterTransitionLeave">
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
			_transitionLeaveCallback: null // mehhhh... read why below in redirect(..)
		} 
	},

	beforeCreate() {
		api.getCurrentUser()
		.then(user => this.currentView = user ? 'App' : 'Login')
		.catch(err => { console.error("Error on finding if user is logged in"); this.currentView = "Login"; });
	},

	methods: {
		afterTransitionLeave() { 
			if(this._transitionLeaveCallback) {
				this._transitionLeaveCallback();
			}
		},

		redirect(page, params = { }) {
			return new Promise((resolve, reject) => {
				this.pageParams = params;
				this.currentView = page;

				// mehhhh... I don't know how this should be done. I cant do $(anim).one('after-leave', ...)
				// because it doesn't seem to work with <transition> and whatnot :/
				this._transitionLeaveCallback = () => {
					resolve();
					this._transitionLeaveCallback = null;
				};
			});
		}
	}
}
</script>

<style lang='scss' scoped>

.fade-enter-active, .fade-leave-active {
	transition: opacity 0.25s ease;
}
.fade-enter, .fade-leave-to, .component-fade-leave-active {
	opacity: 0;
}

</style>
