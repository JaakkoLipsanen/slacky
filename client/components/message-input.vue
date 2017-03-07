<template>
	<textarea class="input-field" ref="input" @keydown.enter="onEnterPressed" placeholder="enter message" autofocus></textarea>
</template>

<script>

import { mapActions } from 'vuex';
export default {
	name: 'message-input',

	mounted() {
	//	this.forceAlwaysFocused(this.$refs.input);
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

		forceAlwaysFocused(textarea) {
			textarea.focus();
			textarea.onblur = () => setTimeout(() => textarea.focus()); // onblur == "on unfocus"
			textarea.onkeydown = e => { 
				// prevents default tab behavior (tab == 9)
				const key = e.which || e.keyCode;
				if(key == 9) e.preventDefault() 
			};
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
