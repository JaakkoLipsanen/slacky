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


const DAYS_IN_WEEK = 7;
const Weekdays = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const differenceInDays = (date1, date2) => {
	// Discard the time and time-zone information.
	let utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	let utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

	const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
	return Math.floor((utc2 - utc1) / MILLISECONDS_PER_DAY);
}

// date.getDay (0-6) returns sunday = 0, and we want monday = 0
const weekday = (date) => (date.getDay() == 0) ? 6 : date.getDay() - 1;
const toOrdinalNumber = (day) => { // 1 -> "1st" etc
	const mod = day % 10;
	if(day < 10 || day > 20) { // 11, 12 and 13 have "th" suffix
		if(mod == 1) return day + "st";
		if(mod == 2) return day + "nd";
		if(mod == 3) return day + "rd";
	}

	return day + "th";
};

// returns for example "Yesterday", "Last Tuesday", "March 20th", "July 2nd, 2015"
const categorizeRelatively = (time, now) => {

	const diffInDays = differenceInDays(time, now);
	if(diffInDays < DAYS_IN_WEEK * 2) { // less than two weeks

		const weekDayNow = weekday(now); // returns [0, 6], where monday == 0
		if(diffInDays === 0) {
			return "Today";
		}
		else if(diffInDays === 1) {
			return "Yesterday";
		}
		else if(diffInDays <= weekDayNow) {
			// The code comes here if the day is on the same week as now
			// for example, if it's Saturday, then Mon-Fri will come here
			return Weekdays[weekday(time)];
		}
		else if(diffInDays <= weekDayNow + 7) {
			// last week
			return `Last ${Weekdays[weekday(time)]}`;
		}
		// aka, IS IN THE FUTURE
		else if(diffInDays < 0) {
			if(diffInDays === -1) return "Tomorrow";

			// TODO: display a more descriptive date :P ?
			return "In the future!";
		}
	}

	// if the day is earlier than the previous week, then display the actual date
	const MonthAndDayStr = `${Months[time.getMonth()]} ${toOrdinalNumber(time.getDate())}`;
	if(time.getFullYear() === now.getFullYear()) { // if same year, then don't display year
		return MonthAndDayStr;
	}

	// if the message was sent on a previous year, then display the year as well
	return `${MonthAndDayStr}, ${time.getFullYear()}`;
};

export default {
	// returns for example "Yesterday", "Last Tuesday", "March 20th", "July 2nd, 2015"
	getRelativeDate(timeToCategorize, now = new Date()) {
		return categorizeRelatively(timeToCategorize, now);
	}
}
