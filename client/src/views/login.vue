<template>
	<div id='login-page'>
		<div class="form-container">
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
			if(this.loginType === LoginType.SignIn) {
				const result = await this.login(username, password);
				return result
			}
			else {
				return await this.register(username, password);
			}
		},

		switchFormType() {
			this.loginType = (this.loginType === LoginType.SignIn) ?
				LoginType.Register : LoginType.SignIn;

			// do i want to reset the username and password fields?
		//	this.$refs.signInForm.reset();
		},

		async login(username, password) {
			const result = await api.login({ username, password });
			return result;
		},

		// TODO: in the backend, separate register and login to different methods
		// (so that calling register doesnt authenticate). Also, login should
		// automatically open connection and return the initial state.
		// on succesful login, render a checkmark like this:
		// http://codepen.io/drewbkoch/pen/ogyXEK maybe inside the login button? idk
		async register(username, password) {
			const result = await api.register({ username, password });
			return result;
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

</style>
