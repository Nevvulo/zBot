exports.settings = {command: "credits", description: "Shows credits and information relating to people who have contributed to zBot.", usage: "credits", throttle: {usages: 2, duration: 7}}
exports.run = async (client, message) => {
	const contributors = {
		"286166184402092042": "providing hosting for zBot <3",
		"278805875978928128": "for providing a codebase for zBot",
		"236279900728721409": "help with lavalink and optimization",
		"284551391781978112": "support, testing and providing ideas",
		"272689325521502208": "big help with nsfw & music commands"
	}

	const Discord = require("discord.js")
	const embed = new Discord.MessageEmbed()
	embed.setAuthor(`Credits » zBot - created by ${client.developer.tag}`, client.user.avatarURL( {format: "png"} ))
	embed.setColor("#e64a19")
	let msg = ""
	for (const i in contributors) {
		const user = await client.users.fetch(i);
		msg += `**${user.tag}** ─ \`${contributors[i]}\`\n`
	}
	embed.setThumbnail(client.user.avatarURL( {format: "png"} ))
	embed.addField("Special Thanks", msg)
	msg = "Badge icons provided courtesy of [`twemoji`](https://github.com/twitter/twemoji)\nBackground images from profiles are primarily provided by [Unsplash](https://unsplash.com/) [(see the full list of background credits here)](https://pastebin.com/YhC7YFBR)"
	embed.addField("Images", msg)
	let thankMessage = "Thanks for using zBot!"

	const messages = {
		"developer": {message: "Thanks for creating zBot!", members: [client.developer.id]},
		"contributor": {message: "Thanks for being involved with the development of zBot!", members: ["284551391781978112", "278805875978928128"]},
		"meme": {message: "Thanks for being gay!", members: ["197532753556668417"]},
		"special": {message: "Thanks for being special!", members: ["269273494733324308"]},
		"patron": {message: "Thanks for being a patron of zBot! You are a sick lad!", members: [message.author.patron]},
		"upvote": {message: "Thanks for upvoting zBot!", members: [message.author.upvoted]}
	}
	for (const i in messages) {
		if (messages[i].members.includes(message.author.id)) {
			thankMessage = messages[i].message
			break
		}
	}
	embed.setFooter(`Finally, thanks to you ${message.author.username}. ${thankMessage}`)
	message.channel.zend({ embed })
}
