exports.settings = {command: "renamechannel", description: "Renames a channel, text or voice.", usage: "renamechannel (voice channel)",
	throttle: {usages: 3, duration: 10}, permission: {command: "mod", user: "MANAGE_CHANNELS"}, info: "`voice channel` parameter can be a channel mention, id or name."}
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const name = args.slice(1).join(" ")
	const prefix = await message.guild.prefix
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a channel to rename. See \`${prefix}help renamechannel\` for more information.`)
	const channel = Find.channel(args[0], message.guild)[0]
	if (!channel) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a channel under that search.`)

	if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) return message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to rename this channel. Make sure I have the \`MANAGE_CHANNELS\` permission and try again.`)
	channel.setName(name)
		.then(res => {
			message.channel.zend(`${client.util.emoji("ok", message.guild)} \`${channel.name}\` was succesfully renamed to \`${res.name}\`.`)
		})
		.catch(err => {
			client.util.log(`Error at renamechannel whilst renaming a channel; ${err}`, "warn")
			message.zreply(`${client.util.emoji("nope", message.guild)} An error occured whilst renaming the channel. Check that I have sufficient permissions to modify channels, and try again.`)
		})
}
