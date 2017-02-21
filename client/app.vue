<template>
	<div v-if="$store.state.isInitialized" id='app' class='row'>
		<Sidebar class='col-fixed-280'></Sidebar>
		<ChatArea class='col-md-12 col-offset-280'></ChatArea>
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

	mounted: function() {
		this.$store.dispatch('establishConnection');
	}
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
