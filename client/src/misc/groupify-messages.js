/* PSA: REALLY UGLY CODE IN HERE :P */

const isSameDay = (date1, date2) => date1 && date2 && date1.toDateString() === date2.toDateString();
const addGroupIfNotEmpty = (toWhere, groupToAdd) => {
	if(groupToAdd.messages.length > 0) toWhere.push(groupToAdd);
};

// returns array of { day: Date, messages: [] }
const groupMessagesByDay = (messages) => {
	const groups = [];
	let currentGroup = { day: undefined, messages: [] };

	for(const message of messages) {
		if(!isSameDay(new Date(message.timestamp), currentGroup.day)) {

			addGroupIfNotEmpty(groups, currentGroup);
			currentGroup = { day: new Date(message.timestamp), messages: [message] };
			continue;
		}

		currentGroup.messages.push(message);
	}

	addGroupIfNotEmpty(groups, currentGroup);
	return groups;
};

export default {

	// returns an array of { dateRelatively, userMessageGroups[] },
	// where in messagesGroupedByUser are objects of { sender, messages[] }
	groupByDayAndUser(messages) {
		const messagesGroupedByDay = groupMessagesByDay(messages);
		const finalGroups = [];

		// bad name :P dayGroup == contains messages from a single day
		for(let dayGroup of messagesGroupedByDay) {
			const userMessageGroups = [];

			let currentGroup = { sender: { }, messages: [] };
			for(let message of dayGroup.messages) {
				if(message.sender.id !== currentGroup.sender.id) {

					addGroupIfNotEmpty(userMessageGroups, currentGroup);
					currentGroup = { sender: message.sender, messages: [message] };
					continue;
				}

				currentGroup.messages.push(message);
			}

			addGroupIfNotEmpty(userMessageGroups, currentGroup);
			finalGroups.push({ day: dayGroup.day, messagesGroupedBySender: userMessageGroups });
		}

		return finalGroups;
	},
};
