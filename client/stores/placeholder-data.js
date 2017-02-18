
// placeholder data
const Pekka = { username: "flai", displayName: "pekka", uid: 1, profilePic: "https://avatars1.githubusercontent.com/u/6358148?v=3&s=460" };
const Anna = { username: "puu", displayName: "anna", uid: 2, profilePic: "http://pradostudio.com/wp-content/uploads/2014/02/BRANDING_LOGOS_1024X680_SPACEX.png" };
const createMessage = (sender, message) => { return { sender: sender, message: message, timestamp: new Date() } };

const rooms = [
{
	name: "General",
	messages: [
		createMessage(Pekka, "Hello"),
		createMessage(Anna, "Hi Pekka!"),
		createMessage(Pekka, "How are you?"),
	]
}, 
{
	name: "Coding",
	messages: [
		createMessage(Pekka, "js vs ts?"),
		createMessage(Anna, "ts!"),
		createMessage(Pekka, "nah, js!"),
	]
}];

const users = { Pekka, Anna };

export { rooms, users, createMessage };