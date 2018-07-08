exports.settings = {command: "mods", description: "Shows all of the available moderators.", usage: "mods [online | offline | idle | dnd] [page]", throttle: {usages: 3, duration: 10}}
exports.run = async (client, message, args) => {
	const Settings = require("./../../structures/general/Settings.js")
	const possibleStatuses = ["offline", "online", "idle", "dnd"]
	const moderatorRole = await Settings.getValue(message.guild, "moderatorRole")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const tosend = []
	let onlineCount = 0
	const moderators = []
	const status = args[0]
	let page = args[1]
	if (page === undefined && status !== undefined) {
		page = status
	}

	if (!message.guild.roles.has(moderatorRole)) return message.zreply(`${client.util.emoji("nope", message.guild)} The owner of this guild hasn't set up a moderator role in the config.`)
	const moderatorAmount = message.guild.roles.get(moderatorRole).members.array().length
	if (moderatorAmount < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} There are no users with the moderator role.`)

	message.guild.members.forEach(member => {
		if (member.roles.highest.comparePositionTo(moderatorRole) >= 0 && !member.user.bot) {
			moderators.push(member)
		}
	})

	for (const i in moderators) {
		const member = moderators[i]
		if (member.presence.status == "online") onlineCount++
		if (possibleStatuses.indexOf(status) > -1) {
			if (member.presence.status == status) {
				tosend.push(`${client.util.emoji(member.presence.status, message.guild)} \`${member.displayName}\``)
			}
		} else {
			tosend.push(`${client.util.emoji(member.presence.status, message.guild)} \`${member.displayName}\``)
		}
	}

	if (tosend.length < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find any moderators under that search.`)
	const mode = (possibleStatuses.indexOf(status) > -1 ? (status == "dnd" ? "in do not disturb mode" : status) : undefined)
	new Interface().PaginationMenu(tosend, {title: `Moderators » ${message.author.tag}`, author: message.author.displayAvatarURL(), type: "Moderators", color: message.guild.roles.get(moderatorRole).hexColor, description: `${client.util.emoji("ok", message.guild)} Here is a list of all of the moderators${!mode ? ".\n" : ` **that are ${mode}**;\n`
	}${client.util.emoji("online", message.guild)} \`${onlineCount}\` out of \`${moderatorAmount}\` moderators are online`, pageLength: 8, delimiter: "\n"}, message, page)
}
