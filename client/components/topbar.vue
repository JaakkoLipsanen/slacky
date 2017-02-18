<template>
	<div id="topbar">
		<h2 class="room-title">#{{ currentRoom.name.toLowerCase() }}</h2>
	</div>
</template>

<script>

import { mapState } from 'vuex';
export default {

	name: 'topbar',
	computed: {
		...mapState(['currentRoom']),
	},
}
</script>

<style lang="scss">

.room-title {
	font-size: 24px;
	font-weight: 600;
	
	color: rgb(72, 72, 72);
}

</style>
