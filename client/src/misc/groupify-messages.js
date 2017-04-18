// groups messages by date


const Months = [
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
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const differenceInDays = (a, b) => {
	// Discard the time and time-zone information.
	let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// date.getDay returns sunday = 0, and we want monday = 0
const weekday = (date) => (date.getDay() == 0) ? 6 : date.getDay() - 1;
const addDaySuffix = (day) => {
	const mod = day % 10;
	if(day < 10 || day > 20) {
		if(day == 1) return day + "st";
		if(day == 2) return day + "nd";
		if(day == 3) return day + "rd";
	}

	return day + "th";
};

// relativeTo == Date.NOW
const categorize = (time, now) => {
	if(time > now) {
		return "In the future!";
	}

	// over two years older (for example, Jan 2017 and Dec 2015)
	// OR over one year older (diff in years == 1 and month is higher than in relativeTo)
	if(time.getFullYear() + 1 < now.getFullYear() ||
		(time.getFullYear() + 1 === now.getFullYear() &&
		time.getMonth() <= now.getMonth())) {

		// "January, 2015" for example
		return `${Months[time.getMonth()]} ${time.getFullYear()}`;
	}

	const diffInDays = differenceInDays(time, now);
	if(diffInDays < 14) { // less than two weeks
		const weekDayNow = weekday(now)
		if(diffInDays === 0) {
			return "Today";
		}
		else if(diffInDays === 1) {
			return "Yesterday";
		}
		else if(diffInDays <= weekDayNow) {
			// The code comes here if the day is on the same week as now
			// for example, if it's Thursday, then Mon-Tue will come here
			return Weekdays[weekday(time)];
		}
		else if(diffInDays <= weekDayNow + 7) {
			return `Last ${Weekdays[weekday(time)]}`;
		}
	}

	if(time.getMonth() != now.getMonth()) {
		if((time.getMonth() == now.getMonth() - 1 && time.getFullYear() == now.getFullYear()) ||
		   (time.getMonth() == 11 && now.getMonth() == 0 && time.getFullYear() + 1 == now.getFullYear())) {

			return "Last month";
		}

		// if same year, then don't put "Last " in front of the month
		if(time.getFullYear() === now.getFullYear()) {
			return `${Months[time.getMonth()]}`
		}

		return `Last ${Months[time.getMonth()]}`;
	}

	return `${Months[time.getMonth()]} ${addDaySuffix(time.getDate())} `
};

export default {
	groupByDate(messages) {
		const NOW = Date.now();

		const groups = [];
		const currentGroup = [];
		for(const message of messages) {
			const categorized = categorize(new Date(message.timestamp));
		}
	},

	categorizeDate: categorize
};
