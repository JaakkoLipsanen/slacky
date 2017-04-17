<template>
	<div id='login-page'>
		<div class="form-container">
			<p ref="errorMessage" class="error-message hidden">{{ errorMessage }}</p>
			<SignInForm
				ref="signInForm"
				:validate-username="validateUsername"
				:validate-password="validatePassword"
				:on-submit="onSubmit"
				:submit-text="submitButtonText" />

			<a @click="switchFormType" class="switch-type-link">{{ switchTypeLinkText }}</a>
		</div>

	</div>
</template>

<script>

import api from '../api';
import SignInForm from '../components/sign-in-form.vue';

const LoginType = {
	SignIn: 0,
	Register: 1
};

export default {
	name: 'login',
	components: {
		SignInForm
	},

	data() {
		return {
			loginType: LoginType.SignIn,
			errorMessage: ""
		};
	},

	mounted() {
		this.errorMessage = this.$router.pageParams.errorMessage || "";
	},

	methods: {
		validateUsername(username) {
			const MinLength = 4;
			const MaxLength = 13;
			const Regex = (/^[a-zA-Z0-9-_]+$/);

			return Boolean(
				username.length >= MinLength &&
				username.length <= MaxLength &&
				Regex.test(username));
		},

		validatePassword(username, password) {
			const MinLength = 6;
			return password.length >= MinLength;
		},

		async onSubmit(username, password) {
			await this.authenticate(username, password);
		},

		switchFormType() {
			this.loginType = (this.loginType === LoginType.SignIn) ?
				LoginType.Register : LoginType.SignIn;

			// do i want to reset the username and password fields?
			this._hideError();
			this.$refs.signInForm.resetErrors();
		},

		// EDIT: Do I want the following?
		// in the backend, separate register and login to different methods
		// (so that calling register doesnt authenticate). Also, login should
		// automatically open connection and return the initial state.
		// on succesful login, render a checkmark like this:
		// http://codepen.io/drewbkoch/pen/ogyXEK maybe inside the login button? idk
		async authenticate(username, password) {
			const loginAPI = (this.loginType === LoginType.SignIn) ? api.login : api.register;
			const result = await loginAPI({ username, password });

			if(result.success) {
				this.$router.redirect('App');
			}
			else {
				this._showError(result.error.message);

				// result.error.type == "username" or "password"
				this.$refs.signInForm.invalidate(result.error.type);
			}
		},

		_showError(message) {
			this.errorMessage = message;
			$(this.$refs.errorMessage).toggleClass("hidden", false);
		},

		_hideError() {
			$(this.$refs.errorMessage).toggleClass("hidden", true);
		}
	},

	computed: {
		submitButtonText() {
			return this.loginType === LoginType.SignIn ?
				"Sign in to Slacky" :
				"Register to Slacky";
		},

		switchTypeLinkText() {
			return this.loginType === LoginType.SignIn ?
				"Don't have an account? Register here!" :
				"Already registered? Sign in here!";
		}
	}
}

</script>

<style lang='scss' scoped>

$form-width: 300px;
.form-container {
	width: $form-width;
	margin: auto;

	max-width: calc(100vw - 16px);
	padding-top: calc(50vh - 60px);

	text-align: center;

	.switch-type-link {
		display: block;
		margin-top: 4px;

		cursor: pointer;
		text-decoration: none;
		user-select: none;
	}
}

.error-message {
	position: absolute;
	margin-top: -40px;
	font-size: 20px;
	color: red;
	text-align: left;

	transition: opacity 0.2s;
	&.hidden {
		opacity: 0;
	}
}

</style>
