exports.settings = {command: "enable", description: "Allows you to manage where zBot commands are allowed to be used.", usage: "enable (command) (channel name | guild)",
	throttle: {usages: 3, duration: 10}, permission: {command: "admin", user: "MANAGE_GUILD"} }
exports.run = async (client, message, args) => {
	const Guild = require("./../../models/guild/Guild.js")
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const subcommand = args[0] || ""
	const secondsubcommand = args[1] || ""
	const prefix = await Settings.getValue(message.guild, "prefix")
	const guild = await Guild.findOne({ where: { id: message.guild.id } })

	function disabled(command) {
		const disable = guild.get("disable");
		for (const i in disable.commands) {
			if (disable.commands[i].command === command) return {disabled: true, id: (disable.commands[i].channelID ? disable.commands[i].channelID :
				disable.commands[i].guildID), where: (disable.commands[i].channelID ? "channel" : "guild")}
		}
		return {disabled: false, id: null, where: null}
	}

	async function remove(command) {
		const isdisabled = disabled(command)
		if (!isdisabled.disabled) return false
		const disable = guild.get("disable");
		for (const i in disable.commands) {
			if (disable.commands[i].command === command) disable.commands.splice(i, 1)
		}
		await message.guild.update("disable", disable)
		return true
	}

	if (subcommand == "") return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${prefix}help ${this.settings.command}\``)

	let channel
	if (secondsubcommand !== "guild") {
		channel = Find.channel(secondsubcommand, message.guild)[0]
		if (channel) {
			if (channel.type != "text") return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a text channel.`)
		} else {
			return message.channel.zend(`${client.util.emoji("nope", message.guild)} That channel doesn't exist. Please enter the name or ID of a channel and try again.`)
		}
	}

	const commandFile = client.commands.get(subcommand)
	if (!commandFile) return message.zreply(`${client.util.emoji("nope", message.guild)} That command doesn't exist.`)

	if (subcommand == commandFile.settings.command) {
		if (secondsubcommand !== "guild") {
			const success = await remove(commandFile.settings.command)
			if (!success) return message.channel.zend(`${client.util.emoji("nope", message.guild)} \`${commandFile.settings.command}\` isn't disabled in <#${channel.id}>.`)
			message.channel.zend(`${client.util.emoji("ok", message.guild)} Users can now use the command \`${commandFile.settings.command}\` in <#${channel.id}>.`)
		} else {
			const success = await remove(commandFile.settings.command)
			if (!success) return message.channel.zend(`${client.util.emoji("nope", message.guild)} \`${commandFile.settings.command}\` isn't disabled anywhere.`)
			message.channel.zend(`${client.util.emoji("ok", message.guild)} Users can now use the command \`${commandFile.settings.command}\` in this guild.`)
		}
	}
}
