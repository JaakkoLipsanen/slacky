<template>
	<div>
		<div> <!-- TODO: blur this div if popup is visible? -->
			<transition name="fade" mode="out-in" @after-leave="afterTransitionLeave">
				<component :is="currentView"></component>
			</transition>
		</div>

		<!-- Popup "manager" -->
		<Popup></Popup>
	</div>
</template>

<script>

import App from './app.vue'
import Login from './login.vue'
import Popup from './popup.vue'
import Loading from './loading.vue'
import api from '../api';

import Vue from 'vue';
Vue.mixin({ // defines this.$router in all vue components..
	computed: { $router() { return this.$root._router; } }
});

export default {
	name: 'router',
	components: {
		App,
		Login,
		Loading,
		Popup
	},

	data() {
		return {
			currentView: 'Loading',
			pageParams: { },
			_transitionEndedCallback: null // mehhhh... read why below in redirect(..)
		}
	},

	async beforeCreate() {
		this.$root._router = this;

		// if the client is not logged in, then tryOpenConnection will fail
		const result = await this.$store.dispatch('openConnection');
		if(result.success) {
			this.currentView = 'App';
		}
		else {
			// specific reason could be determined by result.error.type,
			// but most likely it's just that user isn't logged in
			this.currentView = 'Login';
		}
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
