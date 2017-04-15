<template>
	<transition name="popup-fade" v-if="currentPopup != null">
		<component @success="onSuccess" @cancel="onCancel" :is="currentPopup"></component>
	</transition>
</template>

<script>

import Vue from 'vue';
Vue.mixin({ // defines this.$popup in all vue components..
	computed: { $popup() { return this.$root._popup; } }
});

import NewRoomPopup from '../components/new-room-popup.vue';
Vue.component('new-room-popup', NewRoomPopup);

export default {
	name: 'popup',
	data() {
		return {
			currentPopup: null,
			currentPromise: null,

			isVisible: false
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

				this.isVisible = true;
			});
		},

		// todo: atm what could happen is that show is called twice and first close gets called basically
		// after the second call whic would cause onSuccess to throw null error tjsp.
		close() {
			this.currentPopup = null;
			this.currentPromise = null;

			this.isVisible = false;
		},

		onSuccess(data) {
			this.currentPromise.resolve({ success: true, payload: data });
			this.close();
		},

		onCancel() {
			this.currentPromise.resolve({ success: false });
			this.close();
		}
	}
}
</script>


<style lang='scss' scoped>

$popup-fade-length: 0.15s;
.popup-fade-enter-active, .popup-fade-leave-active {
	transition: opacity $popup-fade-length ease;
}
.popup-fade-enter, .popup-fade-leave-to, .component-popup-fade-leave-active {
	opacity: 0;
}

</style>
