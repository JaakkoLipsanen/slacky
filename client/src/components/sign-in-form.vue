<template>
	<div class="sign-in-form">
		<canvas ref="identicon" width="106" height="106" class="generated-profile-pic" :class="{ visible: usernameValid }"></canvas>

		<!-- Username -->
		<input
			v-model="username"
			ref="usernameInput"
			@input="usernameChanged"
			placeholder="Enter your username"
			type="text"
			autocomplete="off"
			autofocus>

		<!-- Password -->
		<input
			v-model="password"
			ref="passwordInput"
			@input="passwordChanged"
			@keydown.enter="submit"
			placeholder="Enter password"
			type="password">

		<button class="enter-button" :disabled="!usernameValid || !passwordValid" @click="submit">{{ submitText }}</button>
	</div>
</template>

<script>

import identicon from '../misc/identicon';
import RoomList from './room-list.vue';
import ProfileInfo from './profile-info.vue';

export default {
	name: 'sign-in-form',
	props: ["validateUsername", "validatePassword", "onSubmit", "submitText"],

	data() {
		return {
			username: "",
			password: "",

			usernameValid: false,
			passwordValid: false,
		}
	},

	methods: {
		async usernameChanged() {
			this._removeInvalidation(this.$refs.usernameInput);

			this.usernameValid = await Promise.resolve(this.validateUsername(this.username));
			if(this.usernameValid) {
				// TODO: once I allow users to change their profile pic, I probably
				// shouldn't update identicon but rather fetch the image from server
				this._updateIdenticon();
			}
		},

		async passwordChanged() {
			this._removeInvalidation(this.$refs.passwordInput);
			this.passwordValid = await Promise.resolve(this.validatePassword(this.username, this.password));
		},

		async submit() {
			const result = await Promise.resolve(this.onSubmit(this.username, this.password));
			if(!result.success) {
				if(result.error.username) {
					this._invalidate(this.$refs.usernameInput, true);
				}
				else if(result.error.password) {
					this._invalidate(this.$refs.passwordInput);
				}
			}
		},

		reset() {
			this.username = this.password = "";
			this.usernameValid = this.passwordValid = false;

			this.resetErrors();
		},

		resetErrors() {
			this._removeInvalidation(this.$refs.usernameInput);
			this._removeInvalidation(this.$refs.passwordInput);
		},

		_invalidate(input) {
			$(input).toggleClass("errored", true);
		},

		_removeInvalidation(input) {
			$(input).toggleClass("errored", false);
		},

		_updateIdenticon() {
			// update the generated profile pic (which is based on username hash)
			identicon.generate(this.$refs.identicon, this.username);
		}
	}
}
</script>

<style lang="scss">
/** So.... I decided to just absolutely position pretty much every element in here. Too much hassle otherwise :P **/

$input-height: 42px;
$transition-length: 0.35s;

.sign-in-form {
	input {
		width: 100%;
		height: $input-height;
		padding-left: 4px; /* padding-left causes the text inside the textarea to be padded */
		margin-bottom: 8px;
		position: relative;

		box-shadow: none;
		outline: none;

		border: 2px solid rgb(192, 192, 172);
		border-radius: 4px;
		font-size: 20px;

		transition: border-color $transition-length;
		&.errored {
			border-color: red;
		}
	}
}

.generated-profile-pic, .enter-button {
	transition: opacity $transition-length, background $transition-length;

	&.visible {
		opacity: 1;
	}
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

	transition: opacity $transition-length, background $transition-length;

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
	margin-left: -4px;
	transform: translateX(-100%);
	top: calc(50% - 68px);

	/* if the screen is too narrow, then show the profile pic on top of the forms */
	@media (max-width: 520px) {
		margin-left: 0px;
		left: calc(50%);
		top: calc(50% - 168px);
		transform: translate(-50%);
	}

	transition: opacity $transition-length;
	&.visible {
		opacity: 1;
	}

	&:not(.visible) {
		opacity: 0;
	}
}

</style>
