exports.settings = {command: "pfp", description: "Displays yours or another users profile picture.", usage: "pfp [user]", throttle: {usages: 3, duration: 10} }
exports.run = (client, message, args) => {
	const Discord = require("discord.js")
	const Find = require("./../../structures/internal/Find.js")

	let user = args.slice(0).join(" ")

	if (user == "" || user == undefined) {
		user = message.author
	} else {
		user = Find.member(user, message.guild)[0]
		if (user == undefined) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that query.`)
	}

	message.guild.members.fetch(user.id).then(function (member) {
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Profile Picture » ${member.user.tag}`, (member.user.displayAvatarURL().toString().endsWith(".gif") ? `${member.user.displayAvatarURL({size: 2048})}&.gif` : member.user.displayAvatarURL({size: 2048, format: "png"})))
		embed.setColor(member.roles.highest.hexColor)
		embed.setImage((member.user.displayAvatarURL().toString().endsWith(".gif") ? `${member.user.displayAvatarURL({size: 2048})}&.gif` : member.user.displayAvatarURL({size: 2048, format: "png"})))
		message.channel.zend({ embed })
		return
	}).catch(err => {
		throw err
	})
}
