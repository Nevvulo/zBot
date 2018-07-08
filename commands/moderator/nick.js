exports.settings = {command: "nick", description: "Change the nickname of a specified member.", usage: "nick (user) (new nickname | clear)", throttle: {usages: 3, duration: 10},
	permission: {command: "mod", user: "MANAGE_NICKNAMES"} }
exports.run = async (client, message, args) => {
	const prefix = await message.guild.prefix
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter the name of the member you want to unmute. Type \`${prefix}help ${this.settings.command}\` for more information.`)
	const Find = require("./../../structures/internal/Find.js")
	const member = Find.member(args[0], message.guild)[0]
	let nickname = args.slice(1).join(" ")

	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`)
	if (nickname.length > 32) return message.zreply(`${client.util.emoji("nope", message.guild)} The nickname you provided is more than 32 characters.`)
	if (nickname.length < 2) return message.zreply(`${client.util.emoji("nope", message.guild)} The nickname you provided is less than 2 characters.`)
	if (nickname === "clear") nickname = ""
	member.setNickname(nickname).then(success => {
		if (!success.nickname) return message.zreply(`${client.util.emoji("ok", message.guild)} \`${member.user.tag}\`'s nickname has been cleared.`)
		return message.zreply(`${client.util.emoji("ok", message.guild)} \`${member.user.tag}\`'s nickname is now \`${success.nickname}\`.`)
	}).catch(() => {
		return message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to change this user's nickname.`)
	})
}
