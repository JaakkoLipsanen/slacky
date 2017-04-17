// groups messages by date


const Months = [
	"PADDING DONT USE", // I want Months[1] to be january :P
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

// as Date.getDay() returns (0-6)
const Weekdays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

// relativeTo == Date.NOW
const categorize = (time, now) => {
	if(time > now) {
		return "In the future!";
	}

	// over two years older (for example, Jan 2017 and Dec 2015)
	// OR over one year older (diff in years == 1 and month is higher than in relativeTo)
	if(time.getYear() + 1 < now.getYear() ||
		(time.getYear() + 1 === now.getYear() &&
		time.getMonth() >= now.getYear())) {

		// "January, 2015" for example
		return `${Months[time.getMonth()]} ${time.getYear()}`;
	}

	if(time.getMonth() != now.getMonth()) {
		if(time.getMonth() == now.getMonth() - 1 ||
		   (time.getMonth() == 12 && now.getMonth() == 1)) {

			   return "Last month";
		   }

		   return `Last ${Months[time.getMonth()]}`;
	}

	if(time.getYear() < relativeTo.getYear()) {
		return time.getYear() - relativeTo.getYear()
	}
};

export default {
	groupByDate(messages) {
		const NOW = Date.now();

		const groups = [];
		const currentGroup = [];
		for(const message of messages) {
			const categorized = categorize(new Date(message.timestamp));
		}
	}
};