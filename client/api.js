import axios from 'axios';

export default {
	login(userCredentials) {	
		return new Promise((resolve, reject) => {		

			axios.post('/api/auth/login', userCredentials)
			.then(response => resolve(response.data.user))
			.catch(err => console.log(err));
		});
	},

	register(userCredentials) {
		return new Promise((resolve, reject) => {

			axios.post('/api/auth/register', userCredentials)
			.then(response => resolve(response.data.user))
			.catch(err => reject(err));
		});
	},

	logout(userCredentials) {
		return new Promise((resolve, reject) => {

			axios.post('/api/auth/logout')
			.then(() => resolve())
			.catch(err => reject(err));
		});
	},

	validateCredentials(userCredentials) {
		return new Promise((resolve, reject) => {

			axios.post('/api/auth/validate-credentials', userCredentials)
			.then(response => resolve(response.data.valid))
			.catch(err => reject(err));
		});
	},

	// returns the logged in user
	getCurrentUser() {
		return new Promise((resolve, reject) => {

			axios.post('/api/auth/user')
			.then(response => resolve(response.data.user))
			.catch(err => reject(err));
		}); 
	},

	getUser(username) {
		return new Promise((resolve, reject) => {

			axios.get('/api/user/' + username)
			.then(response => resolve(response.data.user))
			.catch(err => reject(err));
		});
	},

	openConnection(onNewMessage) {
		return new Promise((resolve, reject) => {

			axios.post('/api/connection')
			.then(response => resolve(response))
			.catch(err => reject(err.response));
		});
	}
}