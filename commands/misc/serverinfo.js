exports.settings = {command: "serverinfo", description: "View more information about this server.", usage: "serverinfo", 
aliases: ["sinfo", "server"], throttle: {usages: 3, duration: 10} }
exports.run = async (client, message) => {
	const Discord = require("discord.js")
	message.guild.members.fetch()
	let contentFilterMessage = "Don't scan any messages."
	let region = message.guild.region
	console.log(region)

	switch (message.guild.explicitContentFilter) {
	case 1:
		contentFilterMessage = "Scan messages from members without a role."
		break
	case 2:
		contentFilterMessage = "Scan messages sent by all members."
		break
	default:
		break
	}

	const translate = {
		"brazil": {flag: ":flag_br:", name: "Brazil"},
		"eu-central": {flag: ":flag_eu:", name: "Central Europe"},
		"hong-kong": {flag: ":flag_hk:", name: "Hong Kong"},
		"russia": {flag: ":flag_ru:", name: "Russia"},
		"singapore": {flag: ":flag_sg:", name: "Singapore"},
		"sydney": {flag: ":flag_au:", name: "Sydney"},
		"us-central": {flag: ":flag_us:", name: "Central US"},
		"us-east": {flag: ":flag_us:", name: "East US"},
		"us-south": {flag: ":flag_us:", name: "South US"},
		"us-west": {flag: ":flag_us:", name: "West US"},
		"eu-west": {flag: ":flag_us:", name: "West EU"}
	}

	let serverSettings = `**AFK Channel** • ${(message.guild.afkChannel ? message.guild.afkChannel.toString() : "This server has no AFK channel.")}`
	serverSettings += `\n**AFK Timeout** • ${message.guild.afkTimeout} seconds (${message.guild.afkTimeout / 60} minutes)`
	serverSettings += `\n**Explicit Content Filter** • Level ${message.guild.explicitContentFilter + 1} (${contentFilterMessage})`
	console.log(region)
	serverSettings += `\n**Server Region** • ${translate[region].flag} ${translate[region].name}`

	const embed = new Discord.MessageEmbed()
	embed.setAuthor(`Guild Information » ${message.guild.name}`, message.guild.iconURL( {format: "png"} ))
	embed.addField("Members", `**Total** • ${message.guild.memberCount}\n**Humans** • ${message.guild.members.filter(a => !a.user.bot).array().length}\n**Bots** • \
${message.guild.members.filter(a => a.user.bot).array().length}\n**Owner** • ${message.guild.owner.user.tag || "*Owner isn't cached*"}`, true)
	embed.addField("Creation Date", `${message.guild.createdAt.toDateString()} at ${message.guild.createdAt.toLocaleTimeString()}`, true)
	embed.addField("Channels", `**Total** • ${message.guild.channels.filter(c => c.type !== "category").size}\n**Text** • ${message.guild.channels.filter(c => c.type == "text").size} \
\n**Voice** • ${message.guild.channels.filter(c => c.type == "voice").size}\n**Categories** • ${message.guild.channels.filter(c => c.type == "category").size}`, true)
	embed.addField("Roles", `${(message.guild.roles.array().length > 20 ? `${message.guild.roles.array().slice(0, 20).join(" ")}... and \`${
message.guild.roles.array().length - 20}\` more roles.` : message.guild.roles.array().join(" "))}`, true)
	embed.addField("Server Settings", serverSettings, true)
	
	embed.setColor("#EC407A")
	embed.setFooter(`Server ID  ■  ${message.guild.id}`)
	embed.setThumbnail(message.guild.iconURL( {format: "png"} ))
	return message.channel.zend({ embed })
}
