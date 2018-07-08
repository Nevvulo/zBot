exports.settings = {command: "ignore", description: "Allows you to manage where zBot is allowed to function, and what it can do in specific channels.",
	usage: ["ignore (all) (channel name | guild) [true | false]", "ignore (commands) (channel name | guild) [true | false]", "ignore (experience) (channel name | guild) [true | false]",
		"ignore (spam) (channel name | guild) [true | false]", "ignore (expletive) (channel name | guild) [true | false]", "ignore (logs) (channel name | guild) [true | false]"],
	throttle: {usages: 3, duration: 10}, permission: {command: "admin", user: "MANAGE_GUILD"} }
exports.run = async (client, message, args) => {
	const Guild = require("./../../models/guild/Guild.js")
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const subcommand = args[0] || ""
	const secondsubcommand = args[1] || ""
	const prefix = await Settings.getValue(message.guild, "prefix")
	const guild = await Guild.findOne({ where: { id: message.guild.id } })
	const modules = ["commands", "experience", "everything", "spam", "expletive", "logs"]

	if (subcommand == "") return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${prefix}help ${this.settings.command}\``)

	if (subcommand == "list") {
		const ignoredmodules = guild.get("ignore");
		const ignoreArr = []
		const modules = ignoredmodules.modules
		const translate = {
			"commands": "Commands",
			"experience": "Experience Gain",
			"everything": "All zBot Features",
			"spam": "Spam Filter",
			"expletive": "Expletive Filter",
			"logs": "Logging"
		}
		for (const index in modules) {
			if (modules[index]) {
				ignoreArr.push(`\`${modules[index].module.replace(new RegExp(modules[index].module, "ig"), translate[modules[index].module])}\` ── Ignored ${!modules[index].channelID ? "__guild-wide__" : `in **<#${modules[index].channelID}>**`}`)
			}
		}

		if (ignoreArr.length < 1) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} There are no modules being ignored on this server. You can use \`${await Settings.getValue(message.guild, "prefix")}ignore (module) (channel | guild)\` to add one.`)
		new (require("./../../structures/internal/Interface.js")).Interface().PaginationMenu(ignoreArr, {title: `Ignored Modules » ${message.guild.name}`, author: message.guild.iconURL(), type: "Ignored Modules", color: "3f51b5", description: `${client.util.emoji("ok", message.guild)} Here is a list of all of the modules that are being ignored **on this guild**.\nTo see the next page of ignored modules on this guild, `
		+ `type \`${await message.guild.prefix}ignore list [page number]\``, pageLength: 10, delimiter: "\n"}, message, secondsubcommand)
		return
	}

	function ignored(_module) {
		const ignore = guild.get("ignore");
		for (const i in ignore.modules) {
			if (ignore.modules[i].module === _module) return {ignored: true, id: (ignore.modules[i].channelID ? ignore.modules[i].channelID :
				ignore.modules[i].guildID), where: (ignore.modules[i].channelID ? "channel" : "guild")}
		}
		return {ignored: false, id: null, where: null}
	}

	async function add(_module, channel = 0) {
		const isignored = ignored(_module)
		if (isignored.ignored) return false
		const ignore = guild.get("ignore");
		ignore.modules.push({channelID: channel.id, module: _module, guildID: message.guild.id})
		await message.guild.update("ignore", ignore)
		return true
	}

	async function remove(_module) {
		const isignored = ignored(_module)
		if (!isignored.ignored) return false
		const ignore = guild.get("ignore");
		for (const i in ignore.modules) {
			if (ignore.modules[i].module === _module) ignore.modules.splice(i, 1)
		}
		await message.guild.update("ignore", ignore)
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

	let isValid
	let foundModule
	if (modules.indexOf(subcommand) > -1) { isValid = true; foundModule = modules[modules.indexOf(subcommand)] }
	if (!isValid) return message.zreply(`${client.util.emoji("nope", message.guild)} That module doesn't exist.`)

	if (subcommand == foundModule) {
		if (secondsubcommand !== "guild") {
			const success = await add(foundModule, channel)
			if (!success) {
				await remove(foundModule)
				return message.channel.zend(`${client.util.emoji("ok", message.guild)} Module \`${foundModule}\` is no longer ignored in <#${channel.id}>.`)
			}
			message.channel.zend(`${client.util.emoji("ok", message.guild)} Module \`${foundModule}\` will now be ignored in <#${channel.id}>.`)
		} else {
			const success = await add(foundModule)
			if (!success) {
				await remove(foundModule)
				return message.channel.zend(`${client.util.emoji("ok", message.guild)} Module \`${foundModule}\` is no longer ignored guild-wide.`)
			}
			message.channel.zend(`${client.util.emoji("ok", message.guild)} Module \`${foundModule}\` is now ignored guild-wide.`)
		}
	}
}
