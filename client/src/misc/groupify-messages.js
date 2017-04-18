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

	const MonthAndDay = `${Months[time.getMonth()]} ${addDaySuffix(time.getDate())}`;
	if(time.getFullYear() === now.getFullYear()) { // if same year, then don't display year
		return MonthAndDay;
	}

	// if the message was sent on a previous year, then display the year as well
	return `${MonthAndDay}, ${time.getFullYear()}`;
};

// returns array of { title: "DISPLAY DATE STRING", messages: [] }
const groupMessagesByDate = (messages) => {
	const NOW = new Date();

	const groups = [];
	let currentGroup = { title: undefined, messages: [] };

	for(const message of messages) {
		const categorized = categorize(new Date(message.timestamp), NOW);
		if(categorized !== currentGroup.title) {
			if(currentGroup.messages.length > 0) {
				groups.push(currentGroup);
			}

			currentGroup = { title: categorized, messages: [message] };
			continue;
		}

		currentGroup.messages.push(message);
	}

	if(currentGroup.messages.length > 0) {
		groups.push(currentGroup);
	}

	return groups;
};

export default {

	// returns an array of { dateString, messagesGroupedByUser[] },
	// where in messagesGroupedByUser are objects of { sender, messages[] }
	groupByDateAndUser(messages) {
		const messagesGroupedByDate = groupMessagesByDate(messages);

		const finalGroups = [];
		for(let dateGroup of messagesGroupedByDate) {

			const dayGroup = {
				dateString: dateGroup.title,
				messagesGroupedByUser: []
			};

			let currentGroup = { sender: { }, messages: [] };
			for(let message of dateGroup.messages) {
				if(message.sender.id !== currentGroup.sender.id) {
					if(currentGroup.messages > 0) {
						dayGroup.messagesGroupedByUser.push(currentGroup);
					}

					currentGroup = { sender: message.sender, messages: [message] };
					continue;
				}

				currentGroup.messages.push(message);
			}

			if(currentGroup.messages.length > 0) {
				dayGroup.messagesGroupedByUser.push(currentGroup);
			}

			finalGroups.push(dayGroup);
		}

		return finalGroups;
	},



	categorizeDate: categorize
};
