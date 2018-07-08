exports.settings = { command: "autoresponse", description: "Allows you to create autoresponse triggers that will produce a response when someone says the trigger.",
	usage: ["autoresponse create (trigger) (content)", "autoresponse list [page]", "autoresposne remove (trigger)", "autoresponse edit (trigger) (content)"], 
	throttle: { usages: 2, duration: 7 }, permission: {command: "admin", user: "MANAGE_GUILD"} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Guild = require("./../../models/guild/Guild.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const Tags = require("./../../structures/general/Tags.js")
	const subcommand = args[0] || ""
	const argsQuoted = args.join(" ").match(/("[^"]+"|[^ ]+)/g)
	if (!argsQuoted || !args) return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${
		await message.guild.prefix}help ${this.settings.command}\`.`)

	const name = (argsQuoted[1] ? (argsQuoted[1].endsWith("\"") && argsQuoted[1].startsWith("\"") ? argsQuoted[1].slice(1, -1) : argsQuoted[1]) : "")
	const description = argsQuoted.slice(2).join(" ")

	async function createAutoresponse(response, gid) {
		const guild = await Guild.findOne({ where: { id: gid } })
		if (guild == null) return false
		const autoresponses = guild.autoresponses.responses
		autoresponses.push(response)
		const changed = await message.guild.update("autoresponses", { responses: autoresponses })
		return changed
	}

	async function removeAutoresponse(response, gid) {
		const guild = await Guild.findOne({ where: { id: gid } })
		if (guild == null) return false
		const autoresponses = guild.autoresponses.responses
		let index = 0
		for (const i in guild.autoresponses.responses) { if (guild.autoresponses.responses[i].trigger == name) index = i }
		autoresponses.splice(index, 1)
		const changed = await message.guild.update("autoresponses", { responses: autoresponses })
		return changed
	}

	async function editAutoresponse(name, value, gid) {
		const guild = await Guild.findOne({ where: { id: gid } })
		if (guild == null) return false
		const autoresponses = guild.autoresponses.responses
		let index = 0
		for (const i in guild.autoresponses.responses) { if (guild.autoresponses.responses[i].trigger == name) index = i }
		autoresponses[index].response = value
		const changed = await message.guild.update("autoresponses", { responses: autoresponses })
		return changed
	}

	async function grabAutoresponse(name, gid) {
		const guild = await Guild.findOne({ where: { id: gid } })
		if (guild == null) return false
		const autoresponses = guild.autoresponses.responses
		let index = 0
		for (const i in guild.autoresponses.responses) { if (guild.autoresponses.responses[i].trigger == name) index = i }
		return autoresponses[index] || false
	}

	async function checkAutoresponseExists(triggername, gid) {
		const guild = await Guild.findOne({ where: { id: gid } })
		if (guild == null) return false
		for (const i in guild.autoresponses.responses) {
			if (guild.autoresponses.responses[i].trigger == triggername) return true
		}
		return false
	}

	async function listAutoresponses(gid) {
		const guild = await Guild.findOne({ where: { id: gid } })
		if (guild == null) return false
		return guild.autoresponses.responses
	}

	if (subcommand == "create") {
		if (name == "") return message.zreply(`${client.util.emoji("nope", message.guild)} You need to give this autoresponse a name.`)
		if (name.includes("\n")) return message.channel.zend(`${client.util.emoji("nope", message.guild)} Autoresponse triggers cannot contain newlines.`)
		if (name.length < 2) return message.channel.zend(`${client.util.emoji("nope", message.guild)
		} Autoresponse triggers must be longer than 2 characters.`)
		if (description.length < 1) return message.channel.zend(`${client.util.emoji("nope", message.guild)
		} Autoresponse content must contain at least 1 character.`)
		if (await checkAutoresponseExists(name, message.guild.id)) return message.zreply(`${client.util.emoji("nope", message.guild)
		} That autoresponse trigger already exists.`)

		try {
			await createAutoresponse({ trigger: name, response: description }, message.guild.id)
			return message.zreply(`${client.util.emoji("ok", message.guild)} You've successfully created the autoresponse **${name}**.`)
		} catch (e) {
			throw e
		}

	} else if (subcommand == "list") {
		const list = await listAutoresponses(message.guild.id)
		const tagString = list.map(t => t.trigger) || "There are no autoresponse triggers on this guild."
		if (tagString.length < 1) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)
		} There are no autoresponse triggers on this server. You can use \`${await message.guild.prefix
		}autoresponse create (name) (message)\` to create one.`)
		new Interface().PaginationMenu(tagString, {
			title: `Autoresponses » ${message.guild.name}`,
			author: message.guild.iconURL(),
			type: `Autoreponse triggers in ${message.guild.name}`,
			color: "004d40",
			description: `${client.util.emoji("ok", message.guild)
			} Here is a list of all of the autoresponse triggers **on this guild**.\nTo see the next page` +
                ` of autoresponse triggers on this guild, type \`${await message.guild.prefix}autoresponse list [page number]\``,
			pageLength: 30,
			delimiter: "`, `"
		}, message, argsQuoted.slice(1).join(" "))
	} else if (subcommand == "remove") {
		if (!await checkAutoresponseExists(name, message.guild.id)) return message.zreply(`${client.util.emoji("nope", message.guild)
	} There isn't an autoresponse trigger that exists with the name **${name}**.`)
		const removed = await removeAutoresponse(name, message.guild.id)
		return message.zreply(`${client.util.emoji("ok", message.guild)} Autoresponse trigger **${name}** was deleted.`)
	} else if (subcommand == "edit") {
		if (!await checkAutoresponseExists(name, message.guild.id)) return message.zreply(`${client.util.emoji("nope", message.guild)
	} There isn't an autoresponse trigger that exists with the name **${name}**.`)
		const edited = await editAutoresponse(name, description, message.guild.id)
		return message.zreply(`${client.util.emoji("ok", message.guild)} Autoresponse trigger **${name}** was edited successfully.`)
	} else if (subcommand == "variables") {
		const variablesArr = []
		let i = 0
		for (const key of Object.keys(await Tags.grabTagAttributes())) {
			i++
			variablesArr.push(`\`${i}\`. ${key}`)
		}
		new Interface().PaginationMenu(variablesArr, { title: `Variables » ${message.author.tag}`, author: client.user.displayAvatarURL(), type: "Tag Variables",
			color: "000000", description: `${client.util.emoji("ok", message.guild)
			} Here is a list of all of the variables that can be used within autoresponses;`, pageLength: 10 }, message, name)
	} else if (subcommand == "preview") {
		const preview = await grabAutoresponse(name, message.guild.id)
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Preview » ${preview.trigger.length > 1024 ? `${preview.trigger.substr(0, 64)}...` : preview.trigger}`, client.user.displayAvatarURL())
		embed.addField("Content", (preview.response.length > 1024 ? `${preview.description.substr(0, 1019)}...` : preview.response))
		embed.setColor("#26a69a")
		message.channel.zend({ embed })
	}
}
