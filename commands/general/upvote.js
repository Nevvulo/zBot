exports.settings = {command: "upvote", description: "Shows upvote information and perks for zBot.", usage: "upvote", throttle: {usages: 4, duration: 10}}
exports.run = (client, message) => {
	const Discord = require("discord.js")
	const embed = new Discord.MessageEmbed()
	embed.setAuthor(`Upvoting » ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setDescription("**[Click here](https://discordbots.org/bot/z/vote)** to `vote for zBot on Discord Bot List!`\n\n**Upvoting** allows you to receive rewards such as;\n"
	+ "─ Access to NSFW commands\n─ A profile badge in `profile` and `stats`\n─ 2 extra potions when fighting people in challenges!\n\nUpvoting also helps support the development of zBot \nand allows the bot to grow, so vote today!")
	embed.setColor("#66bb6a")
	return message.channel.zend({ embed })
}
