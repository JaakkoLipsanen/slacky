<template>
	<textarea class="input-field" v-on:keydown.enter="onEnter" placeholder="enter message"></textarea>
</template>

<script>

import { mapMutations } from 'vuex';
export default {
	name: 'message-input',
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

		...mapMutations(['sendMessage'])
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
