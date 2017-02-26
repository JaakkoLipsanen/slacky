<template>
	<div class="room-list">
		<h4 class="rooms-header">ROOMS</h4>

		<div v-for="room in $store.state.rooms" class="room-entry-container" :class="{ selected: (room === $store.state.currentRoom) }">
			<a class="room-entry" @click="changeRoom(room)"># {{ room.name.toLowerCase() }}</h1>
		</div>
	</div>
</template>

<script>

import { mapMutations } from 'vuex';
export default {
	name: 'room-list',
	methods: {
		...mapMutations(['changeRoom'])
	}
}
</script>

<style lang="scss" scoped>

.room-list {
	margin-top: 32px;
}

.rooms-header {
	font-size: 16px;
	font-weight: 600;
	color: rgb(164, 164, 164);
	margin-bottom: 6px;
}

.room-entry-container {
	width: 95%;

	padding: 2px;
	padding-left: 4px;	
	border-radius: 4px;

	&.selected {
		background-color: rgb(92, 92, 114);
		.room-entry {
			/* !important overrides the hover */
			color: rgb(244, 244, 244) !important;
		}
	}
}

.room-entry {
	font-size: 16px;
	font-weight: 600;
	color: rgb(172, 172, 172);
	
	cursor: pointer;
	text-decoration: none;

	&:hover:not(.selected) {
		color: rgb(200, 200, 200);
	}
}

</style>
