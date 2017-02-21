<template>
	<textarea ref="inputField" class="input-field" v-on:keydown.enter="onEnter" placeholder="enter message" autofocus></textarea>
</template>

<script>

import { mapActions } from 'vuex';
export default {
	name: 'message-input',

	mounted: function() {
		this.forceAlwaysFocused(this.$refs.inputField);
	},
	
	methods: {
		onEnter: function(event) {
			event.preventDefault(); // makes the element ignore the enter

			const inputField = event.srcElement;
			const text = inputField.value;
			
			if(text.trim().length > 0) {
				this.sendMessage(text);
			}
			
			inputField.value = "";
		},

		forceAlwaysFocused: (textarea) => {
			textarea.focus();
			textarea.onblur = () => setTimeout(() => textarea.focus());
			textarea.onkeydown = e => { 
				// prevents default tab behavior (tab == 9)
				const key = e.which || e.keyCode;
				if(key == 9) e.preventDefault() 
			};
		},

		...mapActions(['sendMessage'])
	}
}
</script>

<style lang="scss" scoped>

.input-field {
	width: 100%;

	border-radius: 4px;
	border-width: 2px;
	border-color: rgb(172, 172, 172);
	resize: none;
    outline: none;
	
	font-size: 20px;
	font-weight: 500;

	/* padding-left causes the text inside the textarea to be padded */
	padding-left: 4px;
}

</style>
