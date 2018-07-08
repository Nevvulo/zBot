exports.settings = {command: "prefix", description: "Allows you to see the current prefix for this guild and set a new one.", usage: "prefix [new prefix]",
	throttle: {usages: 3, duration: 10}, permission: {command: "admin", user: "MANAGE_GUILD"}, info: "Only people with `MANAGE_GUILD` or the server owner can change the prefix."}
exports.run = async (client, message, args) => {
	const prefix = await message.guild.prefix
	const Settings = require("./../../structures/general/Settings.js")
	const isMod = await message.member.permission("MANAGE_GUILD")
	args = args.slice(0).join(" ")

	if (!args) return message.zreply(`${client.util.emoji("ok", message.guild)} The prefix for this guild is currently set as \`${prefix.replace(/`/g, "`").replace(/\n/g)}\`.\nTo change the prefix, type \`${prefix}${this.settings.command} [new prefix]\``)
	if (isMod > 2 || isMod) {
		if (args.includes("\"")) {
			args = args.split("\"")[1].split("\"")[0]
		} else {
			args = args.split(" ")[0]
		}
		await Settings.editSetting(message.guild, "prefix", args)
		return message.zreply(`${client.util.emoji("ok", message.guild)} Great success! The new prefix for this guild is \`${args.replace(/`/g, "`").replace(/\n/g)}\`.`)
	}
}
