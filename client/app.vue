<template>
	<div id='app' class='row'>
		<template v-if="$store.state.isInitialized">
			<Sidebar class='col-fixed-280'></Sidebar>
			<ChatArea class='col-md-12 col-offset-280'></ChatArea>
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
		this.$store.dispatch('establishConnection')
		.catch(err => {
			if(err.data.type === 'auth') {
				// atm the App is the default page. So if user has not logged in before
				// or has logged out, redirect to the login page
				this.$router.redirect('Login');
				return;
			}	
			
			console.error("Unknown error in establishing connection");
		});
	},
}
</script>

<style lang='scss' scoped>
#app {
	margin: 0px;
	height: 100vh;
}

/* apply to all elements */
html * {
	font-family: 'Lato';
}

$sidebar-padding: 15px;
.col-fixed-280 {
	width: 280px; 
	position: fixed; 
	height: 100%;

	padding-left: $sidebar-padding;
	z-index: 1;
}

$chat-area-padding: $sidebar-padding * 2;
.col-offset-280 {
	padding-left: calc(280px + #{$chat-area-padding});
}

</style>
