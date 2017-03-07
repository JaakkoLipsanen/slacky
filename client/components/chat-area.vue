<template>
	<div id="chat-area">
		<Topbar class="topbar"></Topbar>
		<MessageList class="message-list"></MessageList>
		<MessageInput class="message-input"></MessageInput>
	</div>
</template>

<script>

import MessageList from './message-list.vue';
import MessageInput from './message-input.vue';
import Topbar from './topbar.vue';

export default {
	name: 'chat-area',

	components: {
		MessageList,
		MessageInput,
		Topbar
	}
}
</script>

<style lang="scss">
#chat-area { 
	display: flex;
	flex-direction: column;
}

$input-field-margin: 8px;
$input-field-height: 36px;
.message-input {
	margin-top: $input-field-margin;
	height: $input-field-height;
}

$topbar-height: 64px;
.topbar {
	height: $topbar-height;
}

.message-list {
	margin-bottom: $input-field-height;

	height: calc(100vh - #{$topbar-height + $input-field-height + $input-field-margin * 2});
	overflow: auto;	
}
</style>
