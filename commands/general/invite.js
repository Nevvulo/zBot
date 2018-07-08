exports.settings = {command: "invite", description: "Shows invite links and other places you can find zBot.", usage: "invite", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	const Discord = require("discord.js")
	const embed = new Discord.MessageEmbed()
	const base = `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=`

	const admin = 8;
	const normal = 536210679;
	const minimal = 136364160;
	const none = 0;

	embed.setAuthor(`Invite ${client.user.username} » ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setDescription(`**[Click here](${base}${normal})** to \`invite ${client.user.username} to your server!\`\n\n\
[Administrator](${base}${admin}) ─ [Minimal](${base}${minimal}) ─ [No Permissions](${base}${none})
If you don't know which invite to choose,\n\`Administrator\` provides the best experience.`)
	embed.setColor("#388e3c")
	return message.channel.zend({ embed })
}
