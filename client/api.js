import axios from 'axios';

export default {
	async login(userCredentials) {	
		const response = await axios.post('/api/auth/login', userCredentials);
		return response.data.user;
	},

	async register(userCredentials) {
		const response = await axios.post('/api/auth/register', userCredentials)
		return response.data.user;
	},

	async logout(userCredentials) {
		await axios.post('/api/auth/logout')
	},

	async validateCredentials(userCredentials) {
		const response = await axios.post('/api/auth/validate-credentials', userCredentials);
		return response.data.valid;
	},

	// returns the logged in user
	async getCurrentUser() {
		const response = await axios.post('/api/auth/user');
		return response.data.user;
	},

	async getUser(username) {
		const response = await axios.get('/api/user/' + username);
		return response.data.user;
	},

	async openConnection(onNewMessage) {
		const response = await axios.post('/api/connection');
		return response;
	}
}