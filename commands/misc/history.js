exports.settings = {command: "history", description: "Displays yours or another users punishment history.", usage: ["history [latest]", "history list (user) [page]"], throttle: {usages: 3, duration: 10} }
exports.run = async (client, message, args) => {
	const Moderation = require("./../../models/general/Moderation.js")
	const Discord = require("discord.js")
	const Settings = require("./../../structures/general/Settings.js")
	const Punish = require("./../../structures/moderation/Punish.js")
	const Find = require("./../../structures/internal/Find.js")
	const isMod = await message.member.permission("MANAGE_MESSAGES")
	const subcommand = args[0] || "latest"
	let user = (!args[1] ? "" : Find.member(args[1], message.guild)[0]) || args[1]
	const limit = args[2] || args[1];

	if (subcommand == "latest") {
		const latestCase = await Moderation.findOne({ where: { guildID: message.guild.id, userID: message.author.id } })
		if (!latestCase) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} You have no punishments.`)
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`${Punish.options[`${latestCase.type}Options`].title} » ${message.author.tag}`, client.user.displayAvatarURL())
		embed.setDescription(`${(latestCase.type == "warn" ? `You received a ${Punish.options[`${latestCase.type}Options`].names.singular}` : `You were ${Punish.options[`${latestCase.type}Options`].names.tense}`) +
		(Punish.options[`${latestCase.type}Options`].names.from ? " from " : " in ") + message.guild.name} by ${client.users.get(latestCase.punishedBy).toString()}`)
		embed.addField("Reason", latestCase.reason)
		embed.setColor(Punish.options[`${latestCase.type}Options`].color)
		embed.setTimestamp(new Date(latestCase.time))
		message.zreply(`${client.util.emoji("ok", message.guild)} Here is your latest punishment;`)
		return message.channel.zend({ embed })
	} else if (subcommand == "list") {
		if (!isMod) return message.zreply(`${client.util.emoji("nope", message.guild)} Only moderators can check other user's punishment history.`)
		if (user == undefined) user = message.author
		const punishCase = await Moderation.findAll({
			attributes: ["userID", "case", "type", "punishedBy", "reason"],
			where: { guildID: message.guild.id, userID: user.id },
			raw: true
		})
		const punishArr = []
		for (const index in punishCase) {
			const punishObj = punishCase[index]
			if (punishObj) {
				const reason = punishObj.reason.replace(new RegExp("`", "ig"), "\"")
				const msg = `**Case #${punishObj.case}** ─ ${Punish.options[`${punishObj.type}Options`].names.tense.charAt(0).toUpperCase()}${Punish.options[`${punishObj.type}Options`].names.tense.slice(1)} by **${client.users.get(punishObj.punishedBy).tag}** for \`${reason}\`\n`
				punishArr.push(msg)
			}
		}

		if (punishArr.length < 1) return message.channel.zend(`${client.util.emoji("empty", message.guild)} This user has no punishments.`)
		new (require("./../../structures/internal/Interface.js")).Interface().PaginationMenu(punishArr, {title: `Punishments » ${user.user.tag}`, author: user.user.displayAvatarURL(), type: "Punishment History", color: "ec407a", description: `${client.util.emoji("info", message.guild)
		} Showing ${user.toString()}'s punishment history;`, pageLength: 8, delimiter: "\n"}, message, limit)
	} else {
		return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${await Settings.getValue(message.guild, "prefix")}help ${this.settings.command}\`.`)
	}
}
