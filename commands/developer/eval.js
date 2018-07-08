exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Settings = require("./../../structures/general/Settings.js")
	const Timers = require("./../../structures/general/Timers.js")
	const UserBadges = require("./../../structures/user/Badges.js")
	const Find = require("./../../structures/internal/Find.js")
	const Permissions = require("./../../structures/internal/Permissions.js")
	const Playlist = require("./../../structures/general/Playlist.js")
	const Database = require("./../../structures/PostgreSQL.js")
	const sequelize = require("sequelize")
	const User = require("./../../models/user/User.js")
	const Moderation = require("./../../models/general/Moderation.js")
	const Weapon = require("./../../structures/games/Weapon.js")
	const Experience = require("./../../structures/user/Experience.js")
	const moment = require("moment")
	const snekfetch = require("snekfetch")
	const colors = require("colors")
	let displayEval = ""
	let silent = false
	let g = false;

	function clean(text) {
		if (typeof(text) === "string")
			return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`)
		else
			return text
	}

	const argseval = message.content.split(" ").slice(1)
	if (message.author.developer) {
		let code = argseval.join(" ")
		code = code.length > 1010 ? `${code.substr(0, 1010)}...` : code
		if (code.indexOf("--silent") > -1) {
			code = code.replace("--silent", "")
			silent = true
		}
		if (code.indexOf("--g") > -1) {
			code = code.replace("--g", "")
			g = true
		}
		try {
			let promise = false
			let evaled = g ? require("./../../bot.js").broadcastEval(code).join() : eval(code)
			if (evaled instanceof Promise) {
				promise = true
				evaled = await evaled
			}

			if (typeof(evaled) !== "string" && !promise) {
      			evaled = require("util").inspect(evaled)
			}
			if (silent) return

			if (code.includes(client.token) || code.includes("client.token")) displayEval = "what in tarnation no token for you mate"
			displayEval = (evaled === undefined ? "undefined" : evaled.length > 1010 ? `${evaled.substr(0, 1010)}...` : evaled)
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(`Evaluation » ${message.author.tag}`, client.user.displayAvatarURL())
			embed.setDescription(`${client.util.emoji("ok", message.guild)} Here is the evaluation of your code;`)
			embed.addField(`${client.util.emoji("edit", message.guild)} Input`, `\`\`\`js\n${code}\`\`\``)
			embed.addField(`${client.util.emoji("info", message.guild)} Evaluation`, `\`\`\`js\n${displayEval}\`\`\``)
			embed.setColor(promise ? "#ffb300" : "#26a69a")
			message.channel.zend({embed}).then(m => {
				if (promise) {
					m.react(client.util.emoji("typing", message.guild).replace("<:", "").replace(">", ""))
				} else {
					m.react(client.util.emoji("ok", message.guild).replace("<:", "").replace(">", ""))
				}
			})
		} catch (err) {
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(`Evaluation » ${message.author.tag}`, client.user.displayAvatarURL())
			embed.setDescription(`${client.util.emoji("nope", message.guild)} An error occured whilst evaluating your code;`)
			embed.addField(`${client.util.emoji("edit", message.guild)} Input`, `\`\`\`js\n${code}\`\`\``)
			embed.addField(`${client.util.emoji("nope", message.guild)} Error`, `\`\`\`js\n${clean(err)}\`\`\``)
			embed.setColor("#d32f2f")
			message.channel.zend({embed}).then(m => {
				m.react(client.util.emoji("nope", message.guild).replace("<:", "").replace(">", ""))
			})
		}
	} else {
		message.zreply(`${client.util.emoji("nope", message.guild)} You don't have permission to use this command.`)
	}
}

let command = "eval",
	description = "Developer evaluation command.",
	usage = "eval **[code]**",
	permission = "dev",
	category = "DEV"
exports.settings = {
	command: command,
	description: description,
	usage: usage,
	permission: permission, category: category
}
