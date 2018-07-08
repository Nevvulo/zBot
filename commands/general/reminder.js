exports.settings = {
	command: "reminder",
	description: "Allows you to create a reminder with a time limit. When time is up, you'll be DM'd by zBot.",
	usage: ["reminder (time amount) [reason]", "reminder remove (reminder ID)", "reminder list", "reminder edit (reminder ID) (reason (string) | time (amount))"],
	example: "reminder 1h One hour\nThis sets a reminder for 1 hour, with the reason \"One hour\".",
	aliases: ["timer", "remind", "remindme", "rem", "time"],
	throttle: { usages: 2, duration: 7 }
}
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Duration = require("./../../util/Duration.js")
	const Timers = require("./../../structures/general/Timers.js")
	const Timer = require("./../../models/general/Timer.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const Settings = require("./../../structures/general/Settings.js")
	const moment = require("moment")
	require("moment-duration-format")
	const prefix = await Settings.getValue(message.guild, "prefix")

	const cid = args.slice(0).indexOf("--channel")
	const channel = args.slice(cid, cid+1)[cid]

	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)
	} You need to enter an amount of time you want to set for this reminder. For more information, type \`${prefix}help reminder\`.`)
	const time = args[0] || ""
	const subcommand = args[0] || ""
	const secondsubcommand = args[1] || ""
	const thirdsubcommand = args[2] || ""
	const reasonfourth = args.slice(3).join(" ")
	let reason = args.slice(1).join(" ")
	if (reason == "") reason = "*No reason supplied.*"

	if (subcommand == "remove") {
		if (secondsubcommand == undefined) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide a timer ID to remove.`)
		const affectedRows = Timers.removeTimer(secondsubcommand, message.author.id, message.guild.id)
		if (affectedRows < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} Timer \`#${secondsubcommand}\` doesn't exist.`)
		return message.zreply(`${client.util.emoji("ok", message.guild)} You've successfully removed timer \`#${secondsubcommand}\`.`)
	} else if (subcommand == "list") {
		const timers = await Timer.findAll({
			attributes: ["timerID", "userID", "guildID", "timerEnd", "reason"],
			where: { userID: message.author.id, guildID: message.guild.id },
			raw: true,
		})
		const timerArr = []
		for (const index in timers) {
			const timerObj = timers[index]
			const reason = (timerObj.reason == undefined ? "*No reason supplied.*" : timerObj.reason).replace(new RegExp("`", "ig"), "\"")
			const timerDuration = moment(moment.unix(timerObj.timerEnd/1000)).fromNow()
			const msg = `\`Timer #${timerObj.timerID}\` ── Expires ${timerDuration}${reason != "*No reason supplied.*" ? ` with the reason \`${reason
			}\`` : ""}`
			timerArr.push(msg)
		}
		if (timerArr.length < 1) return message.channel.zend(`${client.util.emoji("empty", message.guild)
		} You have no timers on this guild. You can use \`${await Settings.getValue(message.guild, "prefix")
		}reminder (time) [reason]\` to add one.`)
		new Interface().PaginationMenu(timerArr, {
			title: `Timers » ${message.author.tag}`,
			author: message.guild.iconURL(),
			type: "Timers",
			color: "1565c0",
			description: `${client.util.emoji("ok", message.guild)} Here are all of your reminders in **${message.guild.name}**.`,
			pageLength: 7,
			delimiter: "\n"
		}, message, secondsubcommand)
	} else if (subcommand == "edit") {
		let type = {};
		if (thirdsubcommand == "time") {
			const when = await Timers.resolveTime(reasonfourth)
			if (!when) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid time.`)
			if (when.getTime() - Date.now() <= 60000) return message.zreply(`${client.util.emoji("nope", message.guild)
			} You can't set a reminder for less than 1 minute.`)
			type = { "timerEnd": when.getTime() }
		} else if (thirdsubcommand == "reason") {
			type = { "reason": reasonfourth };
		} else {
			return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid option to edit on a reminder. To see more information with editing reminder \
, see \`${prefix}help ${this.settings.command}\`.`)
		}
		const affectedRows = await Timer.update(type, { where: { timerID: secondsubcommand, guildID: message.guild.id, userID: message.author.id } })
		if (affectedRows > 0) return message.zreply(`${client.util.emoji("ok", message.guild)} Timer \`#${secondsubcommand}\` was edited.`)
		return message.zreply(`${client.util.emoji("nope", message.guild)} There's no reminder with the ID \`#${secondsubcommand}\`.`)
	} else {
		const when = await Timers.resolveTime(time)
		if (!when) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid time.`)
		if (when.getTime() - Date.now() <= 29999) return message.zreply(`${client.util.emoji("nope", message.guild)
	} You can't set a reminder for less than 30 seconds.`)

		Timers.createTimer(message.author, message.guild, reason, when.getTime(), time)
		const timeduration = Duration.fromNow(when, true)
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Timer » ${message.author.tag}`, client.user.avatarURL({ format: "png" }))
		embed.setColor("#26c6da")
		embed.setDescription(client.util.emoji("ok", message.guild) + (reason == "*No reason supplied.*" ? ` I'll ping you ${timeduration}.` :
			` I'll remind you ${timeduration} about that.`))
		embed.addField("Reason", reason)
		embed.setFooter("Reminder triggers")
		embed.setTimestamp(new Date(moment(when)))
		return message.channel.zend({ embed })
	}
}
