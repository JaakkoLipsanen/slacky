<template>
	<div class="sign-in-form">
		<canvas ref="identicon" width="106" height="106" class="generated-profile-pic" :class="{ visible: usernameValid }"></canvas>

		<!-- Username -->
		<input
			class="username-input"
			v-model="username"
			ref="usernameInput"
			@input="usernameChanged"
			placeholder="Enter your username"
			type="text"
			autocapitalize="none"
			autocomplete="off"
			autofocus>

		<!-- Password -->
		<input
			class="password-input"
			v-model="password"
			ref="passwordInput"
			@input="passwordChanged"
			@keydown.enter="submit"
			placeholder="Enter password"
			type="password">

		<button class="submit-button" :disabled="!usernameValid || !passwordValid || isAuthenticating" @click="submit">{{ isAuthenticating ? "Authenticating..." : submitText }}</button>
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

			isAuthenticating: false
		}
	},

	methods: {
		async usernameChanged() {
			this._removeInvalidation("username");

			this.usernameValid = await Promise.resolve(this.validateUsername(this.username));
			if(this.usernameValid) {
				// TODO: once I allow users to change their profile pic, I probably
				// shouldn't update identicon but rather fetch the image from server
				this._updateIdenticon();
			}
		},

		async passwordChanged() {
			this._removeInvalidation("password");
			this.passwordValid = await Promise.resolve(this.validatePassword(this.username, this.password));
		},

		async submit() {
			this.isAuthenticating = true;
			await Promise.resolve(this.onSubmit(this.username, this.password));
			this.isAuthenticating = false;
		},

		reset() {
			this.username = this.password = "";
			this.usernameValid = this.passwordValid = false;

			this.resetErrors();
		},

		resetErrors() {
			this._removeInvalidation("username");
			this._removeInvalidation("password");
		},

		invalidate(inputName) {
			this._setInvalidation(inputName, true);
		},

		_removeInvalidation(inputName) {
			this._setInvalidation(inputName, false);
		},

		_setInvalidation(inputName, invalidated) {
			if(inputName !== "username" && inputName !== "password") return;

			const input = (inputName === "username") ?
				this.$refs.usernameInput :
				this.$refs.passwordInput;

			$(input).toggleClass("errored", invalidated);
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

.generated-profile-pic, .submit-button {
	transition: opacity $transition-length, background $transition-length;

	&.visible {
		opacity: 1;
	}
}

$button-base-color: palegreen;
.submit-button {
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
		top: calc(50% - 194px);
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
