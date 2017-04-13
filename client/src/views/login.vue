<template>
	<div id='login-page'>
		<div class="form-group">
			<p class="error-message"> {{ errorMessage }} </p>
			<canvas class="generated-profile-pic" :class="{ visible: isUsernameValid }" ref="identicon" width="106" height="106"></canvas>

			<input class="username-input" :class="usernameInputClasses" v-model="username" type="text" placeholder="Enter your username" @keyup="usernameChanged" ref="usernameInput" autocomplete="off" autofocus>
			<input class="password-input" :class="passwordInputClasses" v-model="password" type="password" placeholder="Enter password" @keyup="passwordChanged" @keydown.enter="login" ><br>

			<button class="enter-button" :disabled="!passwordMatches" v-on:click="login">{{ enterButtonText }}</button>
		</div>
	</div>
</template>

<script>

import api from '../api';
import identicon from '../misc/identicon';

const UsernameState = {
	Invalid: 0,
	Exists: 1, // prompt login
	New: 2,
};

const PasswordState = {
	Invalid: 0,
	Valid: 1, // only for UsernameState.New
	Matches: 2, // only for UsernameState.Exists
};

export default {
	name: 'login',
	data() {
		return {
			username: "",
			usernameState: UsernameState.Invalid,

			password: "",
			passwordState: PasswordState.Invalid,

			errorMessage: "",
		}
	},

	mounted() {
		this.errorMessage = this.$router.pageParams.errorMessage || "";
	},

	computed: {
		isUsernameValid() {
			const MinLength = 4;
			const MaxLength = 13;
			return this.username.length >= MinLength && this.username.length <= MaxLength && (/^[a-zA-Z0-9-_]+$/).test(this.username); // alphanumerics and _ -
		},

		isPasswordValid() {
			return (this.usernameState === UsernameState.Exists && this.passwordState === PasswordState.Matches) ||
				   (this.usernameState === UsernameState.New) && this.isNewPasswordValid(this.password);
		},

		usernameInputClasses() {
			return { 'invalid-input': !this.isUsernameValid && this.username.length !== 0 };
		},

		passwordInputClasses() {
			return { 'invalid-input': this.password.length != 0 && !this.isPasswordValid };
		},

		passwordMatches() {
			if(this.usernameState === UsernameState.Exists) {
				return this.passwordState == PasswordState.Matches;
			}

			return this.isUsernameValid && this.isPasswordValid;
		},

		enterButtonText() {
			return this.usernameState === UsernameState.Exists ? "Log in to Slacky" : "Register to Slacky";
		}
	},

	methods: {
		showError(err) {
			if(!err.response) {
				this.errorMessage = err;
				return;
			}

			this.errorMessage = (err.response.data && err.response.data.error) ? err.response.data.error : "Error";
		},

		async usernameChanged(event) {
			if(!this.isUsernameValid) {
				this.usernameState = UsernameState.Invalid;
				return;
			}

			try {
				const user = await api.getUser(this.username)
				this.usernameState = user ? UsernameState.Exists : UsernameState.New;

				// update the generated profile pic (which is based on username hash)
				identicon.generate(this.$refs.identicon, this.username);
			}
			catch(err) { this.showError(err); }

		},

		isNewPasswordValid: (pw) => pw.length >= 6,
		async passwordChanged(event) {
			const isPasswordValid = this.isNewPasswordValid(this.password);
			if(!isPasswordValid) {
				this.passwordState = PasswordState.Invalid;
				return;
			}

			try {
				const credentialsCorrect = await api.validateCredentials({ username: this.username, password: this.password });
				this.passwordState = credentialsCorrect ? PasswordState.Matches : PasswordState.Invalid;
			}
			catch(err) { this.showErr(err); }
		},

		login(event) {
			const loginFunction = (this.usernameState === UsernameState.New) ? api.register : api.login;
			loginFunction({
				username: this.username,
				password: this.password
			})
			.then(() => this.$router.redirect('App'))
			.catch(this.showError);
		}
	}
}

</script>

<style lang='scss' scoped>
/** So.... I decided to just absolutely position pretty much every element in here. Too much hassle otherwise :P **/

$form-width: 300px;
$input-height: 42px;
$invalid-value-color: rgb(222, 32, 32);

.form-group {
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
	}
}

.invalid-input {
	border-color: $invalid-value-color !important;
}

.username-input {
	margin-bottom: 8px;
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
	margin-top: 8px;

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

.error-message {
	position: absolute;
	top: calc(50% - 92px);

	font-size: 20px;
	font-weight: 600;
	color: $invalid-value-color;
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
