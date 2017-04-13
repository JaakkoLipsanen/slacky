import md5 from 'js-md5';

const config = {
	lightness: {
		color: [0.6, 1],
		grayscale: [0.4, 0.75]
	},
	saturation: 0.75,
	padding: 0.08
};

const hash = (str) => md5(str);
const generate = (element, string) => {	
	if(!jdenticon) {
		console.error("identicon.generate: jdenticon not found");
		return false;
	}

	jdenticon.config = config;
	jdenticon.update(element, hash(string), config.padding);
	return true;
};

const generateToDataURL = (width, height, string) => {	
	const canvas = $("<canvas></canvas>").attr("width", width).attr("height", height).get(0);
	if(!generate(canvas, string)) {
		console.error("Error generating identicon for ", string);
		return "data:,";
	}

	return canvas.toDataURL();
};

export default {
	generate,
	generateToDataURL,
};