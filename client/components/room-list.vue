<template>
	<div class="room-list">
		<h4 class="rooms-header">ROOMS</h4>
		<section v-for="room in rooms" class="room-entry-container" :class="{ selected: (room === currentRoom) }">
			<a class="room-entry" v-on:click="changeRoom(room)"># {{ room.name.toLowerCase() }}</h1>
		</section>
	</div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
export default {
	name: 'room-list',

	computed: {
		rooms: function() {
			return this.$store.state.rooms;
		},

		...mapState(['currentRoom']),
	},

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
	border-radius: 4px;
	width: 95%;

	padding: 2px;
	padding-left: 4px;

	&.selected {
		background-color: lighten(rgb(58, 58, 72), 15);
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
