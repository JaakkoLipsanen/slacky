<template>
	<div class="room-list">
		<h4 class="rooms-header">ROOMS</h4> 
		<a class="new-room-button" @click="showPopup">+</a>

		<div v-for="room in $store.state.chatClient.rooms" class="room-entry-container" :class="{ selected: (room === $store.state.currentRoom) }">
			<a class="room-entry" @click="changeRoom(room)"># {{ room.name.toLowerCase() }}</a>
		</div>
	</div>
</template>

<script>

import { mapMutations } from 'vuex';
export default {
	name: 'room-list',
	methods: {
		...mapMutations(['changeRoom']),

		async showPopup() {
			const payload = await this.$popup.show('new-room-popup');
			this.$store.dispatch('createNewRoom', payload.roomName)
		}
	}
}
</script>

<style lang="scss" scoped>

$text-color: rgb(164, 164, 164);
$selected-color: rgb(200, 200, 200);
$active-color: rgb(224, 224, 224);

.room-list {
	margin-top: 42px;
}

.rooms-header {
	font-size: 16px;
	font-weight: 600;
	color: $text-color;
	display: inline-block;
	margin-top: 0px;
	margin-bottom: 6px;
}

.new-room-button {
	float: right;
	margin-right: 16px;

	font-size: 18px; 
	font-weight: 600;
	color: $text-color;

	cursor: pointer;
	text-decoration: none !important;

	&:hover:not(.selected) {
		color: $selected-color;
	}

	&:active:not(.selected) {
		color: $active-color;
	}
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
	color: $text-color;
	
	cursor: pointer;
	text-decoration: none;

	&:hover:not(.selected) {
		color: $selected-color;
	}

	&:active:not(.selected) {
		color: $active-color;
	}
}

</style>
