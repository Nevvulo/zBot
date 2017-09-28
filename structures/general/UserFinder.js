class UserFinder {

	static getUser(query) {
		if (query.startsWith("<@!") && query.endsWith(">")) {
			query = query.substr(3);
			query = query.slice(0, -1);
	} else if (query.startsWith("<@") && query.endsWith(">")) {
			query = query.substr(2);
			query = query.slice(0, -1);
	}
	var searchResults = [];

	for (let [snowflake, user] of client.users) {
			if (user.username.toLowerCase() == query.toLowerCase()) {
					searchResults.unshift(user);
			} else if (user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
					searchResults.push(user);
			} else if (user.id == query) {
					searchResults.unshift(user);
			}
	}
	if (searchResults.length < 1) {
		throw "I couldn't find any users under that search."
	}
	return searchResults;
  	}

		static getMember(query, guild) {
			if (query.startsWith("<@!") && query.endsWith(">")) {
				query = query.substr(3);
				query = query.slice(0, -1);
		} else if (query.startsWith("<@") && query.endsWith(">")) {
				query = query.substr(2);
				query = query.slice(0, -1);
		}
		var searchResults = [];

		for (let [snowflake, guildmember] of guild.members) {
				if (guildmember.user.username.toLowerCase() == query.toLowerCase()) {
						searchResults.unshift(guildmember);
				} else if (guildmember.user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
						searchResults.push(guildmember);
				} else if (guildmember.displayName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
						searchResults.push(guildmember);
				} else if (guildmember.user.username.toLowerCase() == query.toLowerCase()) {
						searchResults.unshift(guildmember);
				} else if (guildmember.id == query) {
						searchResults.unshift(guildmember);
				}
		}
		if (searchResults.length < 1) {
			throw "I couldn't find any users under that search."
		}
		return searchResults;
	  	}

		static getUserUsernames(query, guild) {
			var searchResults = [];
			if (query.startsWith("<@!") && query.endsWith(">")) {
				query = query.substr(3);
				query = query.slice(0, -1);
		} else if (query.startsWith("<@") && query.endsWith(">")) {
				query = query.substr(2);
				query = query.slice(0, -1);
		}

		for (let [snowflake, user] of client.users) {
				if (user.username.toLowerCase() == query.toLowerCase()) {
					if (searchResults.toString().includes(user.tag)) {
					} else {
						searchResults.unshift(user.tag);
					}
				} else if (user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
					if (searchResults.toString().includes(user.tag)) {
					} else {
						searchResults.push(user.tag);
					}
				} else if (user.tag.toLowerCase().indexOf(query.toLowerCase()) != -1) {
					if (searchResults.toString().includes(user.tag)) {
					} else {
						searchResults.push(user.tag);
					}
				} else if (user.id == query) {
					if (searchResults.toString().includes(user.tag)) {
					} else {
						searchResults.unshift(user.tag);
					}
				}
		}

		if (guild.toString().length > 1) {
		for (let [snowflake, guildmember] of guild.members) {
				if (guildmember.user.username.toLowerCase() == query.toLowerCase()) {
					if (searchResults.toString().includes(guildmember.user.tag)) {
					} else {
						searchResults.unshift(guildmember.user.tag);
					}
				} else if (guildmember.user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
					if (searchResults.toString().includes(guildmember.user.tag)) {
					} else {
						searchResults.push(guildmember.user.tag);
					}
				} else if (guildmember.displayName.toLowerCase().indexOf(query.toLowerCase()) != -1) {
					if (searchResults.toString().includes(guildmember.user.tag)) {
					} else {
						searchResults.push(guildmember.user.tag);
					}
				} else if (guildmember.user.username.toLowerCase() == query.toLowerCase()) {
					if (searchResults.toString().includes(guildmember.user.tag)) {
					} else {
						searchResults.unshift(guildmember.user.tag);
					}
				} else if (guildmember.id == query) {
					if (searchResults.toString().includes(guildmember.user.tag)) {
					} else {
						searchResults.unshift(guildmember.user.tag);
					}
				}
		}
	}
		if (searchResults.length < 1) {
			return "";
		}
		return searchResults;
	  	}

}

module.exports = UserFinder;
