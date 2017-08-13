var git = require('git-last-commit');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
var data = "";
var trimmeddata = "";

class Version {
	static async getVersionNumber() {
		await fs.readFile('./data/main/version/vernum.txt', function(err, data) {
		if(err) throw err;
		data = data.toString();
		return data;
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
