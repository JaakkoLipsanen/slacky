<template>
	<textarea
		ref="input"
		class="input-field"
		@keydown.enter="onEnterPressed"
		placeholder="enter message" autofocus>
	</textarea>
</template>

<script>

import { mapActions } from 'vuex';
export default {
	name: 'message-input',

	mounted() {
		// when room changes, refocus message-input
		this.$store.watch(
			state => state.currentRoom,
			() => this.$refs.input.focus()
		);
	},

	methods: {
		onEnterPressed(event) {
			event.preventDefault(); // makes the element ignore default enter press behavior

			const inputField = event.target;
			const text = inputField.value;

			if(text.trim().length > 0) { // if not empty message
				this.$store.dispatch('sendMessage', text);
			}

			// clear the input field
			inputField.value = "";
		},
	}
}
</script>

<style lang="scss" scoped>

.input-field {
	width: 100%;
	padding-left: 4px; /* padding-left causes the text inside the textarea to be padded */

	border:  2px solid rgb(172, 172, 172);
	border-radius: 4px;

	resize: none;
    outline: none;

	font-size: 20px;
	font-weight: 500;
}

</style>
