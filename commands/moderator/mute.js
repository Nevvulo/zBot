exports.settings = {command: "mute", description: "Mute a specified user on this server.", usage: "mute (user) [duration] [reason]", throttle: {usages: 3, duration: 10},
	permission: {command: "mod", user: "MUTE_MEMBERS"}, info: "The `mute` command is dependant on the `muteRole` setting in `config`. If you haven't set up the `muteRole` in the" +
	"configuration for zBot, this command won't work." }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Punish = require("./../../structures/moderation/Punish.js")
	const Find = require("./../../structures/internal/Find.js")
	const Timers = require("./../../structures/general/Timers.js")
	const Duration = require("./../../util/Duration.js")
	const Settings = require("./../../structures/general/Settings.js")

	let reason = args.slice(1).join(" ") || "*No reason*."
	const prefix = await message.guild.prefix
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to ${this.settings.command}. See \`${prefix}help ${this.settings.command}\` for more information.`)

	// Duration code -- if applicable in command
	const time = args[1] || ""
	const when = await Timers.resolveTime(time)
	let duration = 0
	if (when) {
		if (when.getTime() - Date.now() <= 60000) return message.zreply(`${client.util.emoji("nope", message.guild)
		} The duration of this punishment cannot be below 1 minute.`)
		duration = Duration.fromNow(when, true)
		reason = reason.substr(reason.indexOf(" ") + 1)
	}

	const member = Find.member(args[0], message.guild)[0]
	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`)

	async function confirmPunish(member, duration) {
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Punish » ${member.user.tag}`, member.user.displayAvatarURL())
		embed.addField("Reason", reason.length > 1024 ? `${reason.substr(0, 1019)}...` : reason)
		if (duration) { embed.addField("Duration", `${time} *(Expires ${duration})*`) }
		embed.setColor("#ab47bc")
		embed.setFooter(`Case ${(await Punish.getLastCase(message.guild) + 1)} | ${await Punish.displayPunishmentsText(member, message.guild)}`, client.user.displayAvatarURL())
		return embed
	}

	function punish(guild, type, moderator, member, reason, time) {
		Punish.performPunish(guild, type, moderator, member, reason, time)
		message.channel.zend(`${client.util.emoji("ok", message.guild)} \`${member.displayName}\` was successfully muted.`)
	}

	const muteRole = await Settings.getValue(message.guild, "muteRole")
	if (!message.guild.roles.has(muteRole) || !muteRole) return message.zreply(`${client.util.emoji("nope", message.guild)} The server owner hasn't set the \`muteRole\` setting to a valid role. You can use \
\`${prefix}config set muteRole [role name]\` to set the muted role.` )
	const role = message.guild.roles.get(muteRole)
	if (role.comparePositionTo(message.guild.me.roles.highest.position) > 0) return message.zreply(`${client.util.emoji("nope", message.guild)} I can't mute this person because the \`muteRole\` on this server \
is a higher position than my highest role.`)

	if (await Settings.getValue(message.guild, "punishConfirmation")) {
		const embed = await confirmPunish(member, duration)
		const filter = m => m.author == message.author
		message.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
		.then(collected => {
			switch (collected.first().content.toLowerCase().slice(0, 1)) {
			case "y":
				punish(message.guild, this.settings.command, message.author, member, reason, when || null)
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
			if (!collected.size) return message.channel.zend(`${client.util.emoji("empty", message.guild)} The mute against **${member.displayName}** won't be completed because you didn't reply with an answer in time.`)
		})
		return message.channel.zend(`:gear: **${this.settings.command.toUpperCase()}**: Are you sure you want to issue this mute against **${member.displayName}**? *(__y__es | __n__o)*`, { embed })
	} else {
		punish(message.guild, this.settings.command, message.author, member, reason, when || null);
	}
}
