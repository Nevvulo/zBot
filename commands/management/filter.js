exports.settings = {command: "filter", description: "Allows you to edit what words get blocked by the expletive filter, and if it is enabled.",
	usage: ["filter add (word)", "filter remove (word)", "filter list", "filter toggle", "filter mode (simple | moderate | advanced)", "filter log (true | false)"],
	permission: {command: "mod", user: "MANAGE_CHANNELS"} }
exports.run = async (client, message, args) => {
	const Guild = require("./../../models/guild/Guild.js")
	const Settings = require("./../../structures/general/Settings.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const subcommand = (args[0] == undefined ? "" : args[0].toString())
	const word = args.slice(1).join(" ") || ""
	const defaultarr = [ "fuck", "penis", "cunt", "faggot", "wank", "nigger", "nigga", "slut", "bastard", "bitch", "asshole", "dick", "blowjob", "cock", "pussy", "retard" ]
	const guild = await Guild.findOne({ where: { id: message.guild.id } })

	const remByVal = function(array, val) {
		for (let i = 0; i < array.length; i++) {
			if (array[i] === val) {
				array.splice(i, 1)
				i--
			}
		}
		return array
	}

	if (subcommand == "toggle") {
		if (await Settings.getValue(message.guild, "expletiveFilter")) {
			await Settings.editSetting(message.guild, "expletiveFilter", false)
			message.channel.zend(`${client.util.emoji("ok", message.guild)} The expletive filter on this guild has been toggled **off**.`)
		} else {
			await Settings.editSetting(message.guild, "expletiveFilter", true)
			message.channel.zend(`${client.util.emoji("ok", message.guild)} The expletive filter on this guild has been toggled **on**.`)
		}
	} else if (subcommand == "list") {
		const filter = guild.get("filter");
		if (filter.words.length < 1) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} There are no expletives being censored on this server. You can use \`${await Settings.getValue(message.guild, "prefix")}filter add (word)\` to add one.`)
		new Interface().PaginationMenu(filter.words, {title: `Blocked Words » ${message.guild.name}`, author: client.user.displayAvatarURL(), type: "Blocked Words", color: "424242", description: `${client.util.emoji("ok", message.guild)} Here is a list of all of the blocked words **on this guild**.\nTo see the next page of blocked words on this guild, `
	+ `type \`${await message.guild.prefix}filter list [page number]\``, pageLength: 32, delimiter: "`, `"}, message, word)
	} else if (subcommand == "mode") {
		const filter = guild.get("filter");
		let affectedRows = 0
		let mode
		if (!word) {
			mode = (filter.level == 0 ? "simple" : (filter.level == 1 ? "moderate" : "advanced"))
			return message.zreply(`${client.util.emoji("ok", message.guild)} The filter mode on this guild is currently set to \`${mode}\`.\nYou can set the filter mode to \`simple\`, \`moderate\` or \`advanced\`.`)
		}

		switch (word) {
			case "simple":
			case "0":
				filter.level = 1
				mode = "simple"
				break;
			case "moderate":
			case "1":
				filter.level = 2
				mode = "moderate"
				break;
			case "advanced":
			case "2":
				filter.level = 3
				mode = "advanced"
				break;
			default:
				return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid filter mode.`);			
		}

		affectedRows = await message.guild.update("filter", filter)
		if (affectedRows > 0) return message.zreply(`${client.util.emoji("ok", message.guild)} I've changed the filter mode on this guild to \`${mode}\`.`)
	} else if (subcommand == "add") {
		const filter = guild.get("filter");
		if (remByVal(filter.words, word).length !== filter.words.length) {
			return message.zreply(`${client.util.emoji("nope", message.guild)} The word \`${word}\` already exists in this guilds expletive filter.`)
		} else {
			if (word.length > 64) return message.zreply(`${client.util.emoji("nope", message.guild)} Your word is too long.`)
			if (word.length < 3) return message.zreply(`${client.util.emoji("nope", message.guild)} Your word needs to be longer than 2 characters.`)
			filter.words.push(word)
			const success = await message.guild.update("filter", filter)
			if (success) {
				return message.zreply(`${client.util.emoji("ok", message.guild)} I've added the word \`${word}\` to the expletive filter on this guild.`)
			}
		}
	} else if (subcommand == "remove") {
		const filter = guild.get("filter");
		if (remByVal(filter.words, word).length == filter.words.length) {
			let success = 0
			if (filter.words.length < 1) {
				success = await message.guild.update("filter", defaultarr)
			} else {
				success = await message.guild.update("filter", filter)
			}
			if (success) {
				return message.zreply(`${client.util.emoji("ok", message.guild)} I've removed the word \`${word}\` from the expletive filter on this guild.`)
			} else {
				return message.zreply(`${client.util.emoji("nope", message.guild)} The word \`${word}\` doesn't exist in the expletive filter on this guild.`)
			}

		} else {
			return message.zreply(`${client.util.emoji("nope", message.guild)} The word \`${word}\` doesn't exist in the expletive filter on this guild.`)
		}
	} else if (subcommand == "clear") {
		const success = await message.guild.update("filter", defaultarr)
		if (success) return message.zreply(`${client.util.emoji("ok", message.guild)} The filter list has been cleared.`)
		return message.zreply(`${client.util.emoji("nope", message.guild)} I wasn't able to clear the filter list.`);
	} else {
		message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${await Settings.getValue(message.guild, "prefix")}help ${this.settings.command}\`.`)
	}
}
