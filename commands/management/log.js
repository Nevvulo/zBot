exports.settings = {command: "log", description: "Allows you to change the logging settings for this guild.", usage: "log (category) [setting] [channel id]",
	throttle: {usages: 4, duration: 10}, permission: {command: "admin", user: "MANAGE_GUILD"} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Logs = require("./../../structures/general/Logs.js")
	const Find = require("./../../structures/internal/Find.js")
	const Guild = require("./../../models/guild/Guild.js")
	const category = args[0] || ""
	const setting = args[1] || ""
	const value = args[2] || ""
	if (!category) return initMenu()
	const guild = await Guild.findOne({ where: { id: message.guild.id } })
	const categories = ["message", "member", "moderation"]

	async function initMenu() {
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Logging » ${message.guild.name}`, message.guild.iconURL({format: "png"}))
		embed.setDescription(`${client.util.emoji("info", message.guild)} Here are the categories for logging.\nTo edit logging settings/channels for any of these categories, type \`${await message.guild.prefix}log [category]\``)
		embed.addField("Categories", `\`Message\` ─ **${Object.keys(Logs.logObject.message.modules).length} logging options**\n\`Member\` ─ **${Object.keys(Logs.logObject.member.modules).length} logging options**\n\`Moderation\` ─ **${Object.keys(Logs.logObject.moderation.modules).length} logging options` +
  `**\n\`Other\` ─ **${Object.keys(Logs.logObject.other.modules).length} logging options**\n`)
		embed.setColor("#ff8a65")
		return message.channel.zend({ embed })
	}

	async function createCategoryMenu(type, data) {
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Logging » ${message.guild.name}`, message.guild.iconURL({format: "png"}))
		embed.setDescription(`${client.util.emoji("info", message.guild)} Logging configuration for the \`${type}\` category.\nTo toggle one of these options or change the channel(s), type \`${await message.guild.prefix}log [category] [setting] (value)\``)
		embed.addField("Settings", data)
		embed.setColor("#ff8a65")
		return message.channel.zend({ embed })
	}

	async function add(type, setting, channel) {
		const logs = guild.get("logs");
		logs[type].modules[setting].channels.push(channel)
		if (logs[type].modules[setting].channels.length > 2)
		logs[type].modules[setting].enabled = true
		await message.guild.update("logs", logs)
		return true
	}

	async function remove(type, setting, channel) {
		const logs = guild.get("logs");
		const channels = logs[type].modules[setting].channels
		for (const i in channels) {
			if (channels[i] === channel) {
				logs[type].modules[setting].channels.splice(i, 1)
				logs[type].modules[setting].enabled = false
				await message.guild.update("logs", logs)
				return true
			}
		}
		return false
	}

	function exists(type, setting, channel) {
		const logs = guild.get("logs");
		const channels = logs[type].modules[setting].channels
		if (!channels || channels.length < 1) return false
		for (const i in channels) {
			if (channels[i] === channel) return true
		}
		return false
	}

	if (categories.includes(category.toLowerCase())) {
		if (setting && value) {
			const channel = Find.channel(value, message.guild)[0]
			if (channel) {
				if (channel.type != "text") return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a text channel.`)
			} else {
				return message.channel.zend(`${client.util.emoji("nope", message.guild)} That channel doesn't exist. Please enter the name or ID of a channel and try again.`)
			}

			if (!exists(category, setting, channel.id)) {
				const success = await add(category, setting, channel.id)
				if (success) return message.zreply(`${client.util.emoji("ok", message.guild)} Logs for \`${setting}\` will be sent to ${channel}.`)
				return message.zreply(`${client.util.emoji("nope", message.guild)} You've reached the maximum amount of logging channels for \`${setting}\`.`)
			} else {
				const success = await remove(category, setting, channel.id)
				if (success) return message.zreply(`${client.util.emoji("ok", message.guild)} Logs for \`${setting}\` will no longer be sent to ${channel}.`)
				return message.zreply(`${client.util.emoji("nope", message.guild)} Logs for \`${setting}\` aren't being sent to ${channel}.`)
			}
		}

		const logs = guild.get("logs");
		const arr = []
		Object.entries(logs[category].modules).forEach(
			([key, value]) => {
				const channels = []
				for (const i in value.channels) {
					channels.push(`<#${value.channels[i]}>`)
				}
				arr.push(`\`${key}\` ─ logging to ${channels.join(", ") || "no channels"}`)
			})
		return createCategoryMenu(category, arr)
	} else {
		message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${await message.guild.prefix}help ${this.settings.command}\`.`)
	}
}
