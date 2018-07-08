exports.settings = {command: "links", description: "Displays all the different links that are useful to zBot and different places you can go to learn more about zBot.", usage: "links", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	const Discord = require("discord.js")
	const embed = new Discord.MessageEmbed()
	embed.setAuthor(`Invite Links » ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setDescription("**[Click here](https://discordapp.com/oauth2/authorize?client_id=345766303052857344&scope=bot&permissions=536210679)** to `invite zBot to your server!`\n" +
	"**[Click here](https://discord.gg/uQWCfXB)** to `join our support server!`\n" +
	"**[Click here](https://zbot.me)** to `check out the official zBot website!`\n" +
	"**[Click here](https://discordbots.org/bot/345766303052857344)** to `check out zBot on discordbots.org!`\n" +
	"**[Click here](https://trello.com/b/cxV37X4Y)** to `see the zBot Trello board!`\n")
	embed.setColor("#009688")
	return message.channel.zend({ embed });
}
