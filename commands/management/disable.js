exports.settings = {command: "disable", description: "Allows you to manage where zBot commands are allowed to be used.", usage: "disable (command) (channel name | guild)",
	throttle: {usages: 3, duration: 10}, permission: {command: "admin", user: "MANAGE_GUILD"} }
exports.run = async (client, message, args) => {
	const Guild = require("./../../models/guild/Guild.js")
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const subcommand = args[0] || ""
	const secondsubcommand = args[1] || ""
	const prefix = await message.guild.prefix
	const guild = await Guild.findOne({ where: { id: message.guild.id } })

	if (subcommand == "") return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${prefix}help ${this.settings.command}\``)

	if (subcommand == "list") {
		const disabledCommands = guild.get("disable");
		const disableArr = []
		const commands = disabledCommands.commands
		for (const index in commands) { if (commands[index]) disableArr.push(`\`${commands[index].command}\` ── Disabled ${!commands[index].channelID ? "__guild-wide__" : `in **<#${commands[index].channelID}>**`}`) }

		if (disableArr.length < 1) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} There are no disabled commands on this server. You can use \`${await Settings.getValue(message.guild, "prefix")}disable (command) (channel | guild)\` to add one.`)
		new (require("./../../structures/internal/Interface.js")).Interface().PaginationMenu(disableArr, {title: `Disabled Commands » ${message.guild.name}`, author: message.guild.iconURL(), type: "Disabled Commands", color: "3f51b5", description: `${client.util.emoji("ok", message.guild)} Here is a list of all of the commands that are disabled **on this guild**.\nTo see the next page of disabled commands on this guild, `
	+ `type \`${await message.guild.prefix}disable list [page number]\``, pageLength: 10, delimiter: "\n"}, message, secondsubcommand)
	return;
	}

	function disabled(command) {
		const disable = guild.get("disable");
		for (const i in disable.commands) {
			if (disable.commands[i].command === command) return {disabled: true, id: (disable.commands[i].channelID ? disable.commands[i].channelID :
				disable.commands[i].guildID), where: (disable.commands[i].channelID ? "channel" : "guild")}
		}
		return {disabled: false, id: null, where: null}
	}

	async function add(command, channel = 0) {
		const isdisabled = disabled(command)
		if (isdisabled.disabled) return false
		const disable = guild.get("disable");
		disable.commands.push({channelID: channel.id, command: command, guildID: message.guild.id})
		await message.guild.update("disable", disable)
		return true
	}

	let channel
	if (secondsubcommand !== "guild") {
		channel = Find.channel(secondsubcommand, message.guild)[0]
		if (channel) {
			if (channel.type != "text") return message.zreply(`${client.util.emoji("nope", message.guild)} \`${channel.name}\` is not a text channel.`)
		} else {
			return message.channel.zend(`${client.util.emoji("nope", message.guild)} That channel doesn't exist. Please enter the name or ID of a channel and try again.`)
		}
	}

	const commandFile = client.commands.get(subcommand)
	if (!commandFile) return message.zreply(`${client.util.emoji("nope", message.guild)} That command doesn't exist.`)

	if (subcommand == commandFile.settings.command) {
		if (secondsubcommand !== "guild") {
			const success = await add(commandFile.settings.command, channel)
			if (!success) return message.channel.zend(`${client.util.emoji("nope", message.guild)} \`${commandFile.settings.command}\` is already disabled in <#${channel.id}>.`)
			message.channel.zend(`${client.util.emoji("ok", message.guild)} Users can no longer use the command \`${commandFile.settings.command}\` in <#${channel.id}>.`)
		} else {
			const success = await add(commandFile.settings.command)
			if (!success) return message.channel.zend(`${client.util.emoji("nope", message.guild)} \`${commandFile.settings.command}\` is already disabled in this guild.`)
			message.channel.zend(`${client.util.emoji("ok", message.guild)} Users can no longer the command \`${commandFile.settings.command}\` in this guild.`)
		}
	}
}
