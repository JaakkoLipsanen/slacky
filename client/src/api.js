import _axios from 'axios';
import config from './config';

const axios = _axios.create({
	baseURL: config.SERVER_URL,
	withCredentials: true, // send credentials along on all requests

	// throw error/reject only on 5xx errors
	validateStatus: (status) => status >= 200 && status < 500
});

export default {
	async login(userCredentials) {
		const response = await axios.post('/api/auth/login', userCredentials);
		return response.data;
	},

	async register(userCredentials) {
		const response = await axios.post('/api/auth/register', userCredentials)
		return response.data;
	},

	async logout() {
		await axios.post('/api/auth/logout')
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
