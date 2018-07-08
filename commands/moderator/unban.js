exports.settings = {command: "unban", description: "Unban a specified user from this server.", usage: "unban (user)", throttle: {usages: 3, duration: 10}, permission: {command: "mod", user: "BAN_MEMBERS"} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const user = Find.user(args.slice(0).join(" "))
	const prefix = await message.guild.prefix
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter the ID of a user to unban. See \`${prefix}help unban\` for more information.`)
	if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to unban this person. Make sure I have the \`BAN_MEMBERS\` permission and try again.`)
	const banList = await message.guild.fetchBans()
	if (!banList) return message.zreply(`${client.util.emoji("nope", message.guild)} I need the \`BAN_MEMBERS\` permission in order to see the ban list.`)
	const banned = banList.has(user.id)
	if (!banned) return message.zreply(`${client.util.emoji("nope", message.guild)} That user isn't banned!`)
	message.guild.unban(user, `Unbanned by ${message.author.tag} by using ${prefix}unban`)
	message.zreply(`${client.util.emoji("ok", message.guild)} \`${user.username}\` (${user.id}) has been **unbanned**.`)
}
