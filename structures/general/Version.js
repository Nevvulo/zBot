var git = require('git-last-commit');
const fs = require('fs');
var data = "";
var trimmeddata = "";

class Version {
	static async getVersionNumber(includeVer) {
		await fs.readFile('./data/main/version/vernum.txt', function(err, data) {
		if(err) throw err;
		data = data.toString()
		//includeVer is if you want to include "ver." in the string.
		if (includeVer == "true") {
		return data;
	} else {
		trimmeddata = data.substr(5);
		return trimmeddata;
	}
});

	}

	static async getLatestCommit() {
		await git.getLastCommit(function(err, commit) {
			return commit.subject;
		});
	}

	static getGitHubLink() {
		return "https://www.github.com/zBlakee/Xail-Bot/";
	}
}

module.exports = Version;
