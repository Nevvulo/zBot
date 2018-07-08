exports.settings = {command: "patreon", description: "Shows patreon information for zBot.", usage: "patreon", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	const Discord = require("discord.js")
	const embed = new Discord.MessageEmbed()
	embed.setAuthor(`Patreon » ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setDescription("**[Click here](https://patreon.com/zbot)** to `check out the zBot patreon page!`\n\nYou can check out the different rewards and perks\nyou can get from donating on the page as well!")
	embed.setColor("#ffcdd2")
	return message.channel.zend({ embed })
}
