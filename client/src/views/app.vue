<template>
	<div id='app'>
		<template v-if="$store.state.isConnected">
			<Sidebar class='sidebar'></Sidebar>
			<ChatArea v-if="$store.state.currentRoom != null" class='chat-area'></ChatArea>
		</template>
	</div>
</template>

<script>

import ChatArea from '../components/chat-area.vue';
import Sidebar from '../components/sidebar.vue';

export default {
	name: 'app',

	components: {
		Sidebar,
		ChatArea
	},

	async created() {
		if(!this.$store.isConnected) {
			const result = await this.$store.dispatch('openConnection');
			if(!result.success) {
				this.$router.redirect('Login', { errorMessage: result.error.message });
			}
		}
	},
}
</script>

<style lang='scss' scoped>
#app {
	margin: 0px;
	height: 100vh;
	box-sizing: border-box;
}

$sidebar-width: 250px;
$sidebar-padding: 15px;
.sidebar {
	width: $sidebar-width;
	position: fixed;
	height: 100%;

	padding-left: $sidebar-padding;
	z-index: 1;
}

$chat-area-padding: 30px;
.chat-area {
	width: 100%;
	padding-right: 16px;
	padding-left: calc(#{$sidebar-width + $chat-area-padding});
}

/* TODO: TEMPORARY!! disabled sidebar on narrow screens (like phones)..
   TODO: Create hamburger menu button or something. */
@media (max-width: 540px) {
	.sidebar {
		display: none;
	}

	.chat-area {
		padding-left: $chat-area-padding;
	}
}

</style>
