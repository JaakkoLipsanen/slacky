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
	margin: 0px;

	display: flex;
	flex-direction: column;
}

$input-margin: 8px;
$input-height: 36px;
.message-input {
	margin-top: $input-margin;
	height: $input-height;
}

$topbar-height: 64px;
.topbar {
	height: $topbar-height;
	z-index: 1;
}

.message-list {
	margin-bottom: $input-height;
	flex: 1;

	height: calc(100vh - #{$input-height + $topbar-height + $input-margin * 2});
	overflow: auto;	
}
</style>
