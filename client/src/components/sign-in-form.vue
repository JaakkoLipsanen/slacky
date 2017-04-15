<template>
	<div class="sign-in-form">
		<canvas  ref="identicon" width="106" height="106" class="generated-profile-pic" :class="{ visible: isUsernameValid }"></canvas>

		<!-- Username -->
		<input
			v-model="username"
			ref="usernameInput"
			@keyup="usernameChanged"
			placeholder="Enter your username"
			type="text"
			autocomplete="off"
			autofocus>

		<!-- Password -->
		<input
			v-model="password"
			ref="passwordInput"
			@keyup="passwordChanged"
			placeholder="Enter password"
			type="password">

		<button class="enter-button" :disabled="!passwordMatches" v-on:click="submit">{{ submitText }}</button>
	</div>
</template>

<script>

import RoomList from './room-list.vue';
import ProfileInfo from './profile-info.vue';
export default {
	name: 'sign-in-form',

	data() {
		return {
			username: "",
			password: "",

			usernameValid: true,
			passwordValid: true,
		}
	},

	props: ["validateUsername", "validatePassword", "onSubmit", "submitText"],
	methods: {
		async usernameChanged() {
			updateIdenticon();
			this.usernameValid = await Promise.resolve(this.validateUsername(this.username));
		},

		async passwordChanged() {
			this.passwordValid = await Promise.resolve(this.validatePassword(this.username, this.password));
		},

		submit() {
			this.onSubmit(this.username, this.password);
		},

		updateIdenticon() {
			// update the generated profile pic (which is based on username hash)
			identicon.generate(this.$refs.identicon, this.username);
		}
	}
}
</script>

<style lang="scss">
/** So.... I decided to just absolutely position pretty much every element in here. Too much hassle otherwise :P **/

$form-width: 300px;
$input-height: 42px;
$invalid-value-color: rgb(222, 32, 32);

.sign-in-form {
	width: $form-width;
	max-width: calc(100vw - 16px);
	padding-top: calc(50vh - 60px);
	margin: auto;

	input {
		width: 100%;
		height: $input-height;
		padding-left: 4px; /* padding-left causes the text inside the textarea to be padded */

		box-shadow: none;
		outline: none;

		font-size: 20px;
		border: 2px solid rgb(192, 192, 172);
		border-radius: 4px;

		margin-bottom: 8px;
	}
}


.generated-profile-pic, .enter-button {
	transition: visibility 0.5s, opacity 0.5s, border-color 0.6s, background 0.5s;

	&.visible {
		visibility: visible;
		opacity: 1;
	}
}

.generated-profile-pic {
	opacity: 0;
	visibility: hidden;
}


$button-base-color: palegreen;
.enter-button {
	width: 100%;
	height: 64px;
	margin-top: 0px;

	background: $button-base-color;
	font-size: 24px;
	outline: none;

	border: none;
	border-radius: 4px;

	&:hover:not(:disabled) {
		background: darken($button-base-color, 6);
	}

	&:active:not(:disabled) {
		background: darken($button-base-color, 15);
	}

	&:disabled {
		opacity: 0.85;
		background: desaturate($button-base-color, 100);
	}
}

.generated-profile-pic {
	position: absolute;
	left: calc(50% - #{$form-width / 2} - 4px);
	transform: translateX(-100%);
	top: calc(50% - 68px);

	/* if the screen is too narrow, then show the profile pic on top of the forms */
	@media (max-width: 520px) {
		left: calc(50%);
		top: calc(50% - 168px);
		transform: translate(-50%);
	}
}

</style>
