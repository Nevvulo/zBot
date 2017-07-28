const Discord = require('discord.js');
const Version = require('./../structures/general/Version.js')
const git = require('git-last-commit');
const {
	promisifyAll
} = require('tsubaki');
const fs = promisifyAll(require('fs'));
	let version = "0";

exports.run = (client, message, args) => {
	ver();
	async function ver() {
	version = Version.getVersionNumber();
			console.log(version)
	setTimeout(() => {
		git.getLastCommit(function(err, commit) {
	message.delete();
	const embed = new Discord.RichEmbed()
		.addField('GitHub Repository', Version.getGitHubLink(), true)
		.addField('Xail Bot Version', version, true)
		.addField('Latest Commit', commit.subject, true)
		.setColor(0x00FF00)
		.setFooter('Xail Bot - Derived from AstralMod, heavily modified by zBlake.')
		.setTimestamp()
	message.channel.send({ embed })
	});
}, 200);

	}


};
