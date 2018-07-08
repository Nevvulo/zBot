exports.settings = {command: "kick", description: "Kick a specified user from this server.", usage: "kick (user) [reason]", throttle: {usages: 2, duration: 10},
	permission: {command: "mod", user: "KICK_MEMBERS"} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Punish = require("./../../structures/moderation/Punish.js")
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")

	const reason = args.slice(1).join(" ") || "*No reason*."
	const prefix = await message.guild.prefix
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to ${this.settings.command}. See \`${prefix}help ${this.settings.command}\` for more information.`)

	const member = Find.member(args[0], message.guild)[0]
	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`)

	async function confirmPunish(member) {
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Punish » ${member.user.tag}`, member.user.displayAvatarURL())
		embed.addField("Reason", reason.length > 1024 ? `${reason.substr(0, 1019)}...` : reason)
		embed.setColor("#ffb74d")
		embed.setFooter(`Case ${(await Punish.getLastCase(message.guild) + 1)} | ${await Punish.displayPunishmentsText(member, message.guild)}`, client.user.displayAvatarURL())
		return embed
	}

	function punish(guild, type, moderator, member, reason, time) {
		Punish.performPunish(guild, type, moderator, member, reason, time)
		message.channel.zend(`${client.util.emoji("ok", message.guild)} \`${member.displayName}\` was successfully kicked.`)
	}

	if (!message.guild.member(client.user).hasPermission(this.settings.permission.user) || !member.kickable) return message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to ${this.settings.command} this person. \ 
Make sure I have the \`${this.settings.permission.user}\` permission and try again.`)

	if (await Settings.getValue(message.guild, "punishConfirmation")) {
		const embed = await confirmPunish(member)
		const filter = m => m.author == message.author
		message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
		.then(collected => {
			switch (collected.first().content.toLowerCase().slice(0, 1)) {
			case "y":
				punish(message.guild, this.settings.command, message.author, member, reason, null)
				break
			case "n":
				message.channel.zend(`${client.util.emoji("ok", message.guild)} I won't ${this.settings.command} \`${member.displayName}\`.`)
				break
			default:
				message.channel.zend(`${client.util.emoji("empty", message.guild)} Invalid response received, I won't ${this.settings.command} \`${member.displayName}\`.`)
				break
			}
		})
		.catch(collected => {
			if (!collected.size) return message.channel.zend(`${client.util.emoji("empty", message.guild)} The kick against **${member.displayName}** won't be completed because you didn't reply with an answer in time.`)
		})
		return message.channel.zend(`:gear: **${this.settings.command.toUpperCase()}**: Are you sure you want to issue this kick against **${member.displayName}**? *(__y__es | __n__o)*`, { embed })
	} else {
		punish(message.guild, this.settings.command, message.author, member, reason, when || null);
	}
}
