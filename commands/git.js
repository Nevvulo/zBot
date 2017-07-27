const Discord = require('discord.js');
const fs = require('fs');
const Version = require('./../structures/general/Version.js')
const {
	promisifyAll
} = require('tsubaki');

exports.run = (client, message, args) => {
	git();
	async function git () {
	console.log("I've started the git command.")
	message.delete();
	console.log("Starting embed now.")
	let version = await Promise.resolve(Version.getVersionNumber());
	const embed = new Discord.RichEmbed()
		.addField('GitHub Repository', Version.getGitHubLink(), true)
		.addField('Xail Bot Version', version, true)
		.setColor(0x00FF00)
		.setFooter('Xail Bot - Derived from AstralMod, heavily modified by zBlake.')
		.setTimestamp()
		console.log("Sending embed now.")
	message.channel.send({ embed })
}
};
