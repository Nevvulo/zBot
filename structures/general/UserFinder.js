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

		static getUserUsernames(query) {
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
						searchResults.unshift(user.username);
				} else if (user.username.toLowerCase().indexOf(query.toLowerCase()) != -1) {
						searchResults.push(user.username);
				} else if (user.id == query) {
						searchResults.unshift(user.username);
				}
		}
		
		return searchResults;
	  	}

}

module.exports = UserFinder;
