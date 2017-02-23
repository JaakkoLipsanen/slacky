<template>
	<div id='login-page'>
		<div class="form-group">
			<div>
				<p class="error-message"> {{ errorMessage }} </p>
				<canvas class="generated-profile-pic" :class="{ visible: isValidUsername }" ref="identicon" width="106" height="106"></canvas>

				<input class="username-input" :class="usernameInputClasses" v-model="username" type="text" placeholder="Enter your username" v-on:keyup="usernameChanged" ref="usernameInput" autocomplete="off" autofocus>
				<input class="password-input" :class="passwordInputClasses" v-model="password" type="password" :placeholder="passwordPlaceholderText" v-on:keyup="passwordChanged" v-on:keydown.enter="login" ><br>
						 	
				<button class="enter-button" :class="{ visible: isValidUsername}" :disabled="isValidUsername && !isValidPassword" v-on:click="login">{{ enterButtonText }}</button>
			</div>
		</div>
	</div>
</template>

<script>

import ChatArea from './components/chat-area.vue';
import Sidebar from './components/sidebar.vue';

import api from './api';
import identicon from './misc/identicon';

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
	data: function() {
		return {			
			username: "",
			usernameState: UsernameState.Invalid,

			password: "",
			passwordState: PasswordState.Invalid,

			errorMessage: "",
		}
	},

	mounted: function() {
		this.errorMessage = this.$root.pageParams.errorMessage || "";
	},

	computed: {
		isValidUsername: function() {		
			return this.username.length >= 4 && this.username.length < 20 && (/^[a-zA-Z0-9-_]+$/).test(this.username); // alphanumerics and _ -
		},

		usernameInputClasses: function() {
			return {
				'invalid-input': !this.isValidUsername && this.username.length !== 0
			};
		},

		isValidPassword: function() { 4;
			return (this.usernameState === UsernameState.Exists && this.passwordState === PasswordState.Matches) ||
				   (this.usernameState === UsernameState.New) && (this.password.length === 0 || this.isNewPasswordValid(this.password));
		},

		passwordInputClasses: function() {
			return {
				'visible': this.isValidUsername,
				'invalid-input': this.password.length != 0 && !this.isValidPassword
			};
		},

		passwordPlaceholderText: function() {
			const passwordRequired = this.usernameState !== UsernameState.New;
			return passwordRequired ? 'Enter password' : 'Enter password (optional)';
		},

		isEnterButtonDisabled: function() {
			if(this.usernameState === UsernameState.Exists) {
				return this.passwordState === PasswordState.Matches;
			}

			return false;
		},
		
		enterButtonText: function() {
			if(this.usernameState === UsernameState.Exists) {
				return "Log in to Slacky";
			}
			else { // if(this.usernameState == UsernameState.New)
				if(this.password.length === 0) {
					return "Enter as Guest";
				}
				else {
					return "Register to Slacky";
				}
			}
		}
	},

	methods: {	
		displayError: function(err) { 

			console.error(err);
			if(err.response) {
				this.errorMessage = (err.response.data && err.response.data.error) ? err.response.data.error : "Error";
			}
			else {
				this.errorMessage = err;
			}
		},

		usernameChanged: function(event) {
			if(!this.isValidUsername) {
				this.usernameState = UsernameState.Invalid;
				return;
			}

			api.getUser(this.username)
			.then(user => this.usernameState = user ? UsernameState.Exists : UsernameState.New )
			.catch(this.displayError);

			// update the generated profile pic (which is based on username hash)
			identicon.generate(this.$refs.identicon, this.username);
		},

		isNewPasswordValid: (pw) => pw.length > 4,
		passwordChanged: function(event) {
			const isPasswordValid = this.isNewPasswordValid(this.password);
			if(!isPasswordValid) {
				this.passwordState = PasswordState.Invalid;
				return;
			}

			api.validateCredentials({ username: this.username, password: this.password })
			.then(valid => this.passwordState = valid ? PasswordState.Matches : PasswordState.Invalid )
			.catch(this.displayError);
		},

		login: function(event) {
			
			const loginFunction = (this.usernameState === UsernameState.New) ? api.register : api.login;
			loginFunction({
				username: this.username,
				password: this.password
			})
			.then(() => this.$root.redirect('App'))
			.catch(this.displayError);
		}
	}
}

</script>

<style lang='scss' scoped>
/** So.... I decided to just absolutely position pretty much every element in here. Too much hassle otherwise :P **/

$form-width: 300px;
$input-height: 42px;
$invalid-value-color: rgb(222, 32, 32);

/* apply to all elements */
* {
	font-family: 'Lato';
	font-size: 20px;
}

.form-group {
	width: 100%;
	height: 100vh;
	margin: auto;

	div {
		width: $form-width;
		margin: auto;
		padding-top: calc(50vh - 60px);

		input {
			width: 100%;
			height: $input-height;

			box-shadow: none;
			outline: none;

			border-style: solid;
			border-radius: 4px;
			border-width: 2px;
			border-color: rgb(192, 192, 172);
			
			/* padding-left causes the text inside the textarea to be padded */
			padding-left: 4px;
		}
	}
}

.invalid-input {
	border-color: $invalid-value-color !important;
}

.username-input {
	margin-bottom: 8px;

	opacity: 1 !important;
	visibility: visible !important;
}

.username-input, .password-input, .enter-button, .generated-profile-pic {
	transition: visibility 0.5s, opacity 0.5s, border-color 0.6s, background 0.5s;
	opacity: 0;
	visibility: hidden;

	&.visible {
		visibility: visible;
		opacity: 1;
	}
}

$button-base-color: palegreen;
.enter-button {
	width: 100%;
	height: 64px;
	margin-top: 8px;

	background: $button-base-color;
	font-size: 24px;
	color: rgb(72, 72, 72);
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

	font-weight: 600; 
	color: $invalid-value-color;
}

.generated-profile-pic {
	position: absolute; 
	left: calc(50% - 260px); 
	top: calc(50% - 68px);
}

</style>
