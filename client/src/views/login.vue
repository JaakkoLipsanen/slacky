<template>
	<div id='login-page'>
		<SignInForm
			:validate-username="validateUsername"
			:validate-password="validatePassword"
			:on-submit="onSubmit"
			submit-text="Sign in to Slacky" />
	</div>
</template>

<script>

import api from '../api';
import SignInForm from '../components/sign-in-form.vue';

export default {
	name: 'login',
	data() {
		return { errorMessage: "" }
	},

	components: {
		SignInForm
	},

	mounted() {
		this.errorMessage = this.$router.pageParams.errorMessage || "";
	},

	methods: {
		async validateUsername(username) {
			const MinLength = 4;
			const MaxLength = 13;
			const Regex = (/^[a-zA-Z0-9-_]+$/);

			return
				this.username.length >= MinLength &&
				this.username.length <= MaxLength &&
				Regex.test(this.username);
		},

		async validatePassword(username, password) {
			const MinLength = 6;
			return password >= MinLength;
		},

		async onSubmit(username, password) {
		},

		showError(err) {
			if(!err.response) {
				this.errorMessage = err;
				return;
			}

			this.errorMessage = (err.response.data && err.response.data.error) ? err.response.data.error : "Error";
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

</style>
