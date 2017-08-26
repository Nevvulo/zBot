var git = require('git-last-commit');
var gitCommits = require('git-commits');
var path = require('path');
const zBot = require('./../../bot.js')
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
var data = "";
var trimmeddata = "";

class Version {
	static getVersionNumber(includeVer) {
		console.log(Version.version)
		if (zBot.version !== undefined) return zBot.version
	}

	static async getLatestCommit() {
		var repoPath = path.resolve(process.env.REPO || (__dirname + './../../.git'));
		var commitTitle = "Error whilst collecting commit.";
		gitCommits(repoPath, {
	    limit: 1
	  }).on('data', function(commit) {
			commitTitle = commit.title;
	  }).on('error', function(err) {
	    throw err;
	  }).on('end', function() {
			console.log(commitTitle)
			return commitTitle;
	  });
	}

	static getGitHubLink() {
		return "https://www.github.com/zBlakee/zBot/";
	}
}

module.exports = Version;
