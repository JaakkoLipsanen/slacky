<template>
	<ul class='message-list'>
		<li v-for="msg in displayedMessages">
			<div class="profile-pic" :style="`background-image: url( ${getProfilePic(msg.sender)} )`" />

			<div class="message-text-container">
				<h4 class="message-sender">{{ msg.sender.username }}</h4>
				<h4 class="message-time">{{ formatTime(msg.timestamp) }}</h4>
				<h4 class="message-text">{{ msg.text }}</h4>
			</div>
		</li>
		<li v-for="group in messageGroups"></li>
	</ul>
</template>

<script>

import profilePicCache from '../misc/profile-pic-cache';
import groupify from '../misc/groupify-messages';

export default {

	name: 'message-list',
	computed: {

		// why? see explanation below in the css
		displayedMessages() {
			return this.$store.state.currentRoom.messages.slice().reverse();
		},

		messageGroups() {
			const groups = groupify.groupByDate(this.$store.state.currentRoom.messages.slice().reverse());
		}
	},

	methods: {
		getProfilePic: (user) => profilePicCache.get(user),
		formatTime(date) {
			const pad = (num) => (num < 10 ? "0" : "") + num;

			date = date.getHours ? date : new Date(date); // if date is not Date object, then convert it
			return pad(date.getHours()) + ":" + pad(date.getMinutes());
		}
	}
}
</script>

<style lang="scss" scoped>

.message-list {
	padding-left: 2px;
	margin: 0px;

	li {
		margin-top: 12px;
	}
}

$profile-pic-size: 40px;
$profile-pic-margin: 3px;
.profile-pic {
	width: $profile-pic-size;
	height: $profile-pic-size;

	margin-right: $profile-pic-margin;
	vertical-align: top;

	background-size: cover;
	background-position: center;
}

.message-text-container {
	max-width: calc(100% - #{$profile-pic-size + 2 * $profile-pic-margin});
	display: inline-block;
}

.message-sender {
	display: inline-block;
	font-size: 15px;
	font-weight: 900;

	margin-top: 0px;
	margin-bottom: 4px;

	color: rgb(64, 64, 64);
}

.message-time {
	display: inline-block;
	font-size: 12px;
	font-weight: 600;

	margin-top: 0;
	margin-bottom: 0px;
	margin-left: 4px;

	color: rgb(144, 144, 144);
}

.message-text {
	font-size: 16px;
	font-weight: 500;

	margin: 0px;
}

/* very much of an hack :P makes the list items be aligned from bottom to top.
   also causes the list items to be rendered in wrong order, which is why displayMessages
   computed property is required. look into whether bottom-align ul can be done nicer */
/* TODO: this also causes the scrollign to be inverted :D ! */
ul, ul li {
	transform: scaleY(-1);
}

</style>
