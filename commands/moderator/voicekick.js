exports.settings = {command: "voicekick", description: "Kicks all members from a specific voice channel by deleting then re-creating the channel.", usage: "voicekick (voice channel)",
	throttle: {usages: 3, duration: 10}, permission: {command: "mod", user: "MANAGE_CHANNELS"}, info: "`voice channel` parameter can be a channel mention, id or name."}
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	args = args.slice(0).join(" ")
	const prefix = await message.guild.prefix
	if (!args) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a channel to kick members from. See \`${prefix}help voicekick\` for more information.`)
	const channel = Find.channel(args, message.guild)[0]
	if (!channel) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a channel under that search.`)
	if (channel.type !== "voice") return message.zreply(`${client.util.emoji("nope", message.guild)} That channel is not a voice channel.`)

	if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) return message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to re-create this channel. Make sure I have the \`MANAGE_CHANNELS\` permission and try again.`)
	const position = channel.position
	channel.delete().catch(() => {
		message.zreply(`${client.util.emoji("nope", message.guild)} An error occured whilst deleting the channel. Check that I have sufficient permissions to delete/modify channels, and try again.`)
	})
	channel.clone().then(res => {
		res.setPosition(position)
		message.channel.zend(`${client.util.emoji("ok", message.guild)} All members within \`${channel.name}\` were kicked.`)
	})
}
