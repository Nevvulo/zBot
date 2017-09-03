const Discord = require('discord.js');
const Version = require('./../structures/general/Version.js')
const gitCommits = require('git-commits');
const path = require('path');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
	let version = "0";

exports.run = (client, message, args) => {
	ver();
	async function ver() {
	version = Version.getVersionNumber(true);
	console.log(version)
	setTimeout(() => {
	message.delete();
	var repoPath = path.resolve(process.env.REPO || (__dirname + './../.git'));
	var commitTitle = "Error whilst collecting commit.";
	gitCommits(repoPath, {
		limit: 1
	}).on('data', function(commit) {
		commitTitle = commit.title;
	}).on('error', function(err) {
		throw err;
	}).on('end', function() {
		console.log(commitTitle)

	const embed = new Discord.MessageEmbed()
		.addField('GitHub Repository', Version.getGitHubLink(), true)
		.addField('zBot Version', version, true)
		.addField('Latest Commit', commitTitle, true)
		.setColor(0x00FF00)
		.setFooter('zBot - GitHub information')
		.setTimestamp()
	message.channel.send({ embed })
	});
}, 100);
	}
};

let command = 'git'
, description = 'Shows GitHub information regarding zBot.'
, usage = 'git'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
