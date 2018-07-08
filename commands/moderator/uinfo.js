exports.settings = { command: "uinfo", description: "View specific information on a user.", usage: "uinfo (user)", throttle: { usages: 3, duration: 10 } }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Find = require("./../../structures/internal/Find.js")
	const Punish = require("./../../structures/moderation/Punish.js")
	const Permissions = require("./../../structures/internal/Permissions.js")
	const moment = require("moment")
	require("moment-duration-format")
	args = args.slice(0).join(" ")
	const isMod = await Permissions.grabPermissionLevel(message.author, message.guild, "MANAGE_NICKNAMES")

	const statuses = {
		"online": "Online",
		"offline": "Offline/Invisible",
		"idle": "Idle",
		"dnd": "Do Not Disturb"
	}

	async function generate(member) {
		const memberExists = message.guild.members.has(member.id)
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`User Information » ${memberExists ? member.user.tag : member.tag}`, memberExists ? member.user.displayAvatarURL() : member.displayAvatarURL())
		let descriptiontext = "";
		if (!memberExists) descriptiontext += `${client.util.emoji("info", message.guild)} This user is not a member of ${message.guild.name}.\n`
		if (message.author.patron) descriptiontext += `${client.util.emoji("donator", message.guild)} This user has donated on the ${client.user.username} Patreon page!\n`
		if (descriptiontext) embed.setDescription(descriptiontext)
		embed.setColor("#e74c3c")
		let names = `**Username** • ${memberExists ? member.user.username : member.username}\n`
		names += `**Discriminator** • ${memberExists ? member.user.discriminator : member.discriminator}\n`
		memberExists ? names += `**Nickname** • ${member.nickname ? member.nickname : "*This user has no nickname.*"}` : ""
		embed.addField("Names", names, true)

		let timestamps = `**Created** • ${moment(`${memberExists ? member.user.createdAt.toLocaleDateString() : member.createdAt.toLocaleDateString()} ${memberExists ?
member.user.createdAt.toLocaleTimeString() : member.createdAt.toLocaleTimeString()}`, "YYYY-MM-DD h:mm:ss a").format("Do [of] MMMM, YYYY [at] h:mm:ss a")} \
(${moment(`${memberExists ? member.user.createdAt.toLocaleDateString() : member.createdAt.toLocaleDateString()}
${memberExists ? member.user.createdAt.toLocaleTimeString() : member.createdAt.toLocaleTimeString()}`).fromNow()})\n`
		if (memberExists) {
			timestamps += `**Joined** • ${moment(`${member.joinedAt.toLocaleDateString()} ${member.joinedAt.toLocaleTimeString()}`,
			"YYYY-MM-DD h:mm:ss a").format("Do [of] MMMM, YYYY [at] h:mm:ss a")} (${moment(`${member.joinedAt.toLocaleDateString()} ${member.joinedAt.toLocaleTimeString()}`).fromNow()})\n`
			if (!member.joinedAt.getTime()) { timestamps = "**Joined** • *An error has occured*." }
		}
		embed.addField("Timestamps", timestamps, true)

		let identification = memberExists ? `**Highest Role** • ${member.roles.highest.toString()}\n` : ""
		identification += `**Status** • ${client.util.emoji(member.presence.status, message.guild)} ${statuses[member.presence.status]}`
		if (memberExists ? member.user.presence.activity : member.presence.activity) identification += `\n**Presence** • ${memberExists ? member.user.presence.activity : member.presence.activity}`
		embed.addField("Identification", identification, true)

		if ((isMod > 0 || isMod === true) && memberExists) embed.addField("Punishment History", await Punish.displayPunishmentsText(member, message.guild), true)

		if (memberExists) {
			let moreinformation = ""
			if (member.serverMute) moreinformation += "This user is `server-muted`.\n"
			if (member.serverDeaf) moreinformation += "This user is `server-deafened`.\n"
			if (member.selfMute) moreinformation += "This user is `self-muted`.\n"
			if (member.selfDeaf) moreinformation += "This user is `self-deafened`.\n"
			if (moreinformation) embed.addField("More Information", moreinformation, true)
		}
		embed.setThumbnail(memberExists ? member.user.displayAvatarURL() : member.displayAvatarURL())
		embed.setFooter(`User ID - ${memberExists ? member.user.id : member.id}`)

		return embed
	}

	if (!args) args = message.author.id
	let member = Find.member(args, message.guild)[0];
	if (!member) member = Find.user(args)[0]
	if (!member) member = client.users.fetch(args);
	if (!member) message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that query.`)
	const em = await generate(member);
	return message.channel.zend({ embed: em })
}
