exports.settings = { command: "config", description: "Allows you to change the configuration of zBot.", usage: ["config list [page]", "config set (setting) (value)", "config view (setting)"],
	throttle: { usages: 2, duration: 7 }, permission: { command: "admin", user: "MANAGE_GUILD" } }
exports.run = async (client, message, args) => {
	const Settings = require("./../../structures/general/Settings.js")
	const Find = require("./../../structures/internal/Find.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const Discord = require("discord.js")
	const { GuildConfigurationHidden, GuildConfiguration } = require('./../../util/Constants.js')

	const argument = args[0]
	const setting = args[1]
	let value = args.slice(2).join(" ")

	if (argument == "clear") {
		await Settings.editSetting(message.guild, setting, GuildConfiguration[setting])
		return message.channel.zend(`${client.util.emoji("ok", message.guild)} \`${setting}\` is no longer set on this server.`)
	} else if (argument == "view") {
		if (setting == undefined) return message.channel.zend(`${client.util.emoji("nope", message.guild)} You need to provide a setting to view.`)
		if (await Settings.getValue(message.guild, setting) == undefined) return message.channel.zend(`${client.util.emoji("nope", message.guild)} The setting you've provided doesn't exist. Try \`${await Settings.getValue(message.guild, "prefix")}help ${this.settings.command}\` to see all of the available settings you can view.`)

		if (Settings.getSettingType(setting) === "Channel") {
			const channel = message.guild.channels.find("id", await Settings.getValue(message.guild, setting))
			if (channel == undefined) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} The current value for the setting *${setting}* is not a valid channel. You'll need to change it to a valid channel for it to work.`)
			return message.channel.zend(`${client.util.emoji("ok", message.guild)} The current value for the setting *${setting}* is: __${channel}__`)
		}

		if (Settings.getSettingType(setting) === "Role") {
			const role = message.guild.roles.find("id", await Settings.getValue(message.guild, setting))
			if (role == undefined) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} The current value for the setting *${setting}* is not a valid role. You'll need to change it to a valid role for it to work.`)
			return message.channel.zend(`${client.util.emoji("ok", message.guild)} The current value for the setting *${setting}* is: __${role.name}__`)
		}
		const currentSetting = await Settings.getValue(message.guild, setting)
		message.channel.zend(`${client.util.emoji("ok", message.guild)} The current value for the setting *${setting}* is: __${currentSetting}__`)
	} else if (argument == "set") {
		if (setting == undefined) return message.channel.zend(`${client.util.emoji("nope", message.guild)} You need to provide a setting to edit.`)
		if (value == undefined) return message.channel.zend(`${client.util.emoji("nope", message.guild)} You need to provide a new value to this setting.`)
		if (await Settings.getValue(message.guild, setting) == undefined) return message.channel.zend(`${client.util.emoji("nope", message.guild)} The setting you've provided doesn't exist. Try \`${await Settings.getValue(message.guild, "prefix")}config list\` to see all of the available settings you can view.`)

		if (Settings.getSettingType(setting) === Number) {
			if (isNaN(Number(value))) return message.zreply(`${client.util.emoji("nope", message.guild)} This value needs to be a valid number.`)
			if (Number(value) > 100000 || Number(value) < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} That number is too high/low.`)
			if (Number(value) < Number(setting)) return message.zreply(`${client.util.emoji("nope", message.guild)} The maximum value cannot be lower than the minimum value.`)
			value = Number(value).toString()
		}

		if (Settings.getSettingType(setting) === "Role") {
			const role = Find.role(value, message.guild)[0]
			if (!role) return message.channel.zend(`${client.util.emoji("nope", message.guild)} That role doesn't exist. Please enter the name or ID of a role (ex. \`Moderator\` or \`347236141444890624\`) and try again.`)
			await Settings.editSetting(message.guild, setting, role.id)
			return message.channel.zend(`${client.util.emoji("ok", message.guild)} I've set \`${setting}\` to the role ${role.name}.`)
		}

		if (Settings.getSettingType(setting) === "Channel") {
			const channel = Find.channel(value, message.guild)[0]
			if (!channel) return message.channel.zend(`${client.util.emoji("nope", message.guild)} That role doesn't exist. Please enter the name or ID of a role (ex. \`Moderator\` or \`347236141444890624\`) and try again.`)
			if (channel.type != "text") return message.channel.zend(`${client.util.emoji("nope", message.guild)} \`${channel.name}\` is not a text channel.`)
			await Settings.editSetting(message.guild, setting, channel.id)
			return message.channel.zend(`${client.util.emoji("ok", message.guild)} I've set \`${setting}\` to the channel \`${channel.name}\`.`)
		}

		if (Settings.getSettingType(setting) === Boolean) {
			console.log(value)
			switch (value) {
				case "true":
					await Settings.editSetting(message.guild, setting, true)
					break;
				case "false":
					await Settings.editSetting(message.guild, setting, false)
					break;
				default:
					return message.channel.zend(`${client.util.emoji("nope", message.guild)} You can only change this setting to one of the following values: __true__ or __false__.`);
			}
			return message.channel.zend(`${client.util.emoji("ok", message.guild)} I've set the setting __\`${setting}\`__ to \`${value}\`.`)
		}

		if (Settings.getSettingType(setting) === "Prefix") {
			if (value.includes("\"")) {
				value = value.split("\"")[1].split("\"")[0]
			} else {
				value = value.split(" ")[0]
			}
		}

		if (Settings.getSettingType(setting) === String) value = value;

		await Settings.editSetting(message.guild, setting, value)
		message.channel.zend(`${client.util.emoji("ok", message.guild)} I've set the setting *${setting}* to __${value}__.`)
	} else if (argument == "list") {
		let isConflicting = false
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Settings » ${message.guild.name}`, client.user.displayAvatarURL())
		const tosend = []
		const permissionsRequired = {
			"expletiveFilter": "MANAGE_MESSAGES",
			"spamFilter": "MANAGE_MESSAGES",
			"deleteUserCommand": "MANAGE_MESSAGES"
		}
		for (let [key, value] of Object.entries(await Settings.getAllSettings(message.guild))) {
				let settingvalue = value
				if (settingvalue == undefined) settingvalue = "null"
				if (GuildConfigurationHidden.includes(key)) continue;
				if (key == "createdAt" || key == "updatedAt" || key == "id" || key == "guildID") continue;
				if (message.guild.roles.has(value)) {
					settingvalue = `<@&${value}>`
				}

				if (message.guild.channels.has(value)) {
					settingvalue = `<#${value}>`
				}
				let msg = ""
				if (permissionsRequired[key] != undefined) {
					if (!message.guild.member(client.user.id).hasPermission(permissionsRequired[key], true, true)) {
						isConflicting = true
						msg = `  ─  ${client.util.emoji("warning", message.guild)} *Missing \`${permissionsRequired[key]}\` permission.*`
					}
				}
				if (settingvalue.length > Math.round(1000 / 7)) {
					tosend.push(`\`${key}\`  ❯  ${settingvalue.substr(0, 50)}...${msg}`)
				} else {
					tosend.push(`\`${key}\`  ❯  ${settingvalue}${msg}`)
				}
			}

		new Interface().PaginationMenu(tosend, {title: `Settings » ${message.guild.name}`, author: message.guild.iconURL(), type: "Configuration", color: "34495e", description: `${client.util.emoji("ok", message.guild)} Here are all of the possible editable settings in zBot.\nTo edit any of these settings, type \`${await Settings.getValue(message.guild, "prefix")
		}config set [setting] [new value]\`.\nTo see the next page of settings, type \`${await message.guild.prefix}config list [page number]\`.${!isConflicting ? "" : `\n\n${client.util.emoji("nope", message.guild)} You have one or more conflictions in your configuration.\nConflicting settings will still work, but may not function as intended.`}`, pageLength: 7}, message, setting)
	} else {
		message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${await message.guild.prefix}help ${this.settings.command}\`.`)
	}
}
