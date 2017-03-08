<template>
	<transition v-if="currentPopup != null">
		<component @success="onSuccess" @cancel="onCancel" :is="currentPopup"></component>
	</transition>
</template>

<script>

import Vue from 'vue';
Vue.mixin({ // defines this.$popup in all vue components..
	computed: { $popup() { return this.$root._popup; } }
});

import NewRoomPopup from './components/new-room-popup.vue';
Vue.component('new-room-popup', NewRoomPopup);

export default {
	name: 'popup',
	data() { 
		return { 
			currentPopup: null, 
			currentPromise: null
		} 
	},

	beforeCreate() {
		this.$root._popup = this;
	},

	methods: {
		show(popupName) {
			return new Promise((resolve, reject) => {
				this.currentPromise = { resolve: resolve, reject: reject };
				this.currentPopup = popupName;
			});
		},

		// todo: atm what could happen is that show is called twice and first close gets called basically
		// after the second call whic would cause onSuccess to throw null error tjsp.
		close() {
			this.currentPopup = null;
			this.currentPromise = null;
		},

		onSuccess(data) {
			this.currentPromise.resolve(data);
			this.close();
		},

		onCancel() {
			this.currentPromise.reject();
			this.close();
		}
	}
}
</script>