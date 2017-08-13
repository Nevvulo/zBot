var git = require('git-last-commit');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
var data = "";
var trimmeddata = "";

class Version {
	static getVersionNumber(includeVer) {
		if (includeVer) return "ver. 1.4.7";
		else return "1.4.7"
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
