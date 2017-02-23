<template>
	<ul class='message-list'>
		<li class="message-block" v-for="msg in displayedMessages">
			<div class="profile-pic" :style="'background-image: url(' + getProfilePic(msg.sender) + ')'" />

			<div>
				<h4 class="message-sender">{{ msg.sender.username }}</h4>
				<h4 class="message-time">{{ formatTime(msg.timestamp) }}</h4>
				<h4 class="message-text">{{ msg.text }}</h1>
			</div>
		</li>
	</ul>
</template>

<script>

import profilePicCache from '../misc/profile-pic-cache';
import { mapState } from 'vuex';
export default {

	name: 'message-list',
	computed: {
		...mapState(['currentRoom']),

		// why? see explanation below in the css
		displayedMessages: function() { 
			return this.currentRoom.messages.slice().reverse();
		},
	},

	methods: {
		formatTime: (date) => {
			const pad = (num) => (num < 10 ? "0" : "") + num;
			
			date = new Date(date);
			return pad(date.getHours()) + ":" + pad(date.getMinutes());
		},

		getProfilePic: (user) => profilePicCache.get(user)
	}
}
</script>

<style lang="scss" scoped>

.message-list {
	width: 100%;

	margin-top: 0px;
	padding-left: 2px;
	margin: 0px;
}

.message-block {
	list-style-type: none;
	margin-top: 12px;
}

.profile-pic {
	width: 40px;
	height: 40px;
	background-size: cover;
	background-position: center;
	vertical-align: top;
	margin-right: 3px;

	/* + div selects the first div after .profile-pic */
	&+ div {
		display: inline-block;
	}
}

.message-sender {
	display: inline-block;
	font-size: 15px;
	font-weight: 900;

	margin-bottom: 4px;
	margin-top: 0px;

	color: rgb(64, 64, 64);
}

.message-time {
	display: inline-block;
	font-size: 12px;
	margin-top: 0;
	margin-bottom: 0px;

	padding-left: 4px;
	color: rgb(144, 144, 144);
	font-weight: 600;
}

.message-text {
	font-size: 16px;
	font-weight: 500;

	margin-top: 0px;
	margin-bottom: 0px;
}

/* very much of an hack :P makes the list items be aligned from bottom to top.
   also causes the list items to be rendered in wrong order, which is why displayMessages
   computed property is required. look into whether bottom-align ul can be done nicer */
ul, ul li {
	transform: scaleY(-1);
}

</style>
