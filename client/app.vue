<template>
	<div id='app'>
		<template v-if="$store.state.isConnected">
			<Sidebar class='sidebar'></Sidebar>
			<ChatArea class='chat-area'></ChatArea>
		</template>
	</div>
</template>

<script>

import ChatArea from './components/chat-area.vue';
import Sidebar from './components/sidebar.vue';

export default {
	name: 'app',

	components: {
		Sidebar,
		ChatArea
	},

	created() {
		// :/ move this to login page and/or router? If on login page, there would also not be
		// any chance of lag/hitchup on transitions
		this.$store.dispatch('openConnection')
		.catch(err => {
			if(err.data && err.data.type === 'auth') {
				// atm the App is the default page. So if user has not logged in before
				// or has logged out, redirect to the login page
				this.$router.redirect('Login');
				return;
			}	
			
			console.error("Unknown error in establishing connection: " + err);
		});
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
