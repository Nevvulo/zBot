exports.settings = { command: "afk", description: "Toggle your AFK status in zBot.", usage: "afk [reason]", throttle: { usages: 3, duration: 10 } }
exports.run = async (client, message, args) => {
	const reason = args.slice(0).join(" ") || null
	const user = (await message.member.profile);

	if (user.get("afk").afk) {
		await message.member.update("afk", { afk: true, reason: null })
		return message.zreply(`${client.util.emoji("ok", message.guild)} You are no longer AFK.`)
	} else {
		await message.member.update("afk", { afk: true, reason: reason })
		return message.zreply(
			`${client.util.emoji("ok", message.guild)} You are now marked as AFK.\nIf you are mentioned in a message, I'll let that user know that you are AFK${reason !== null ? ` with the reason \`${reason}\`.` : "."}`
		)
	}
}
