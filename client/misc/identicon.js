import md5 from 'js-md5';

const generate = (element, string) => {	
	if(!jdenticon) {
		console.error("identicon.generate: jdenticon not found");
		return
	}

	jdenticon.update(element, md5(string));
};

export default {
	generate
};