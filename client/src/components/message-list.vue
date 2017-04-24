<template>
	<!-- TODO: this is awful :D split this to smaller components or something -->

	<ul class='message-list' @scroll="onScrollChanged">

		<!-- The messages are grouped by day, one of these represents one day -->
		<div class="date-message-block" v-for="dayGroup in messagesGroupedByDay">

			<!-- The date "divider", (like "Today, "Yesterday", "March 5th" etc) -->
			<p class="message-date-divider">{{ getRelativeDate(dayGroup.day) }} </p>

			<!-- The messages are grouped so that if one user sends multiple messages
			     consecutively, the username and user's profile pic is displayed only once -->
			<div class="user-message-block" v-for="senderGroup in dayGroup.messagesGroupedBySender">

				<!-- Show the profile pic on the left -->
				<div class="profile-pic"
					:style="`background-image: url( ${getProfilePic(senderGroup.sender)} )`"></div>

				<!-- Then, to the right of the profile pic, display the
				     sender's name and all consecutive messages by the user -->
				<div class="message-content-group">
					<h4 class="message-sender">{{ senderGroup.sender.username }}</h4>
					<h4 class="message-time">{{ formatTime(senderGroup.messages[0].timestamp) }}</h4>

					<!-- The consecutive messages -->
					<div class="consecutive-messages-list">
						<li v-for="msg in senderGroup.messages">
							<div class="message-content-container">
								<h4 class="message-text">{{ msg.text }}</h4>
								<h4 class="time">{{ formatTime(msg.timestamp) }}</h4>
							</div>
						</li>
					</div>
				</div>
			</div>
		</div>
	</ul>
</template>

<script>

import profilePicCache from '../misc/profile-pic-cache';
import relativeDate from '../misc/relative-date';
import groupify from '../misc/groupify-messages';

export default {

	name: 'message-list',
	computed: {
		currentRoom() {
			return this.$store.state.currentRoom;
		},

		displayedMessages() {
			return this.currentRoom.messages.slice();
		},

		// see groupify-messages.js to see what this returns
		messagesGroupedByDay() {
			return groupify.groupByDayAndUser(this.displayedMessages);
		},
	},

	watch: {
		currentRoom() {
			// scroll to bottom when room changes
			this.scrollToBottomNextUpdate = true;
		},

		displayedMessages() {
			// when new message is sent, if the list was scrolled to the bottom before,
			// then keep it scrolled down
			if(this.isScrolledToBottom) {
				this.scrollToBottomNextUpdate = true;
			}
		}
	},

	mounted() {
		// scroll to bottom of the list when the message-list is loaded
		this.scrollToBottom();
	},

	// updated is called after every (internal vue) render
	updated() {
		if(this.scrollToBottomNextUpdate) {
			this.scrollToBottom();
		}
	},

	methods: {
		getProfilePic: (user) => profilePicCache.get(user),
		getRelativeDate: relativeDate.getRelativeDate,

		formatTime(date) {
			const pad = (num) => (num < 10 ? "0" : "") + num; // 3 -> "03" etc

			date = date.getHours ? date : new Date(date); // if date is not Date object, then convert it
			return pad(date.getHours()) + ":" + pad(date.getMinutes());
		},

		// updates the "isScrolledToBottom" variable when scroll changes
		onScrollChanged() {
			// how many pixels from the bottom is categorized as "is on bottom"
			const IsScrolledToBottomBias = 20;

			// based on http://stackoverflow.com/a/21067431
			const messageList = $(".message-list")[0];

			const totalHeight = messageList.scrollHeight;
			const visibleHeight = messageList.clientHeight;
			const scrollPosition = messageList.scrollTop; // the scroll position at the top
			const distanceFromBottom = (totalHeight - visibleHeight) - scrollPosition;

			this.isScrolledToBottom = distanceFromBottom <= IsScrolledToBottomBias;
		},

		scrollToBottom(immediate) {
			const messageList = $(".message-list")[0];

			const totalHeight = messageList.scrollHeight;
			const visibleHeight = messageList.clientHeight;
			messageList.scrollTop = totalHeight - visibleHeight;

			this.isScrolledToBottom = true;
			this.scrollToBottomNextUpdate = false;
		}
	}
}
</script>

<style lang="scss" scoped>

.message-list {
	padding-left: 2px;
	margin: 0px;

	display: flex;
	flex-flow: column nowrap;

	:first-child {
		/* required for scrolling, justify-content: flex-end breaks scrolling */
		margin-top: auto !important;
	}
}

.user-message-block {
	margin-bottom: 12px;
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

.message-content-group {
	display: inline-block;
	max-width: calc(100% - #{$profile-pic-size + 2 * $profile-pic-margin + 1px});
	width: 100%;
	white-space: nowrap;
}

.message-sender {
	display: inline-block;
	margin: 0px;
	margin-bottom: 4px;

	font-size: 15px;
	font-weight: 900;
	color: rgb(64, 64, 64);
}

.message-time {
	display: inline-block;
	margin: 0px;
	margin-left: 4px;

	font-size: 12px;
	font-weight: 600;
	color: rgb(144, 144, 144);
}

.message-content-container {
	display: inline-block;
	width: 100%;
}

.message-text {
	font-size: 16px;
	font-weight: 500;

	margin: 0px;
	display: inline-block;
	white-space: normal;
	overflow-wrap: break-word;
	user-select:  initial; /* allow user to select text (disabled elsewhere by default) */

	/* - 50px so that there is space for the time (when hovered) on the right of the text */
	max-width: calc(100% - 50px)
}

.consecutive-messages-list {
	margin-top: -4px;

	li {
		list-style: none;
		margin: 0px;
		margin-top: 3px;

		.time {
			display: inline;
			margin-left: 14px;

			transition: opacity 0.4s;
			opacity: 0;

			font-size: 12px;
			font-weight: 600;
			color: rgb(174, 174, 174);
		}

		&:hover {
			.time {
				opacity: 1;
			}
		}
	}
}

.message-date-divider {
	font-size: 16px;
	font-weight: 600;
	margin-top: 5px;
}

</style>
