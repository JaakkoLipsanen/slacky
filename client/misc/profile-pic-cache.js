import md5 from 'js-md5';
import identicon from './identicon';

// TODO: support different sizes?
const ProfilePicSize = 40;
const generaterProfilePics = new Map();

export default {
	get(user) {
		if(user.profilePic) {
			return user.profilePic;
		}

		const key = user.username;
		if(!generaterProfilePics.has(key)) {
			generaterProfilePics.set(key, identicon.generateToDataURL(ProfilePicSize, ProfilePicSize, user.username));
		}

		return generaterProfilePics.get(key);
	}
};