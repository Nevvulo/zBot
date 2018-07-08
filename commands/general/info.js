exports.settings = { command: "info", description: "View technical information relating to zBot.", usage: "info [commands]", throttle: { usages: 3, duration: 10 } }
exports.run = async (client, message, args) => {
	const CommandHandler = new(require("./../../structures/internal/CommandHandler.js"))
	const Discord = require("discord.js")
	const moment = require("moment")
	const bot = require("./../../bot.js")
	require("moment-duration-format")
	const uptime = moment.duration(process.uptime() * 1000, "milliseconds").format("D [days], H [hrs], m [mins], s [secs]")
	args = args.toString()
	if (args == "command" || args == "commands") {
		const globalUsage = []
		const guildUsage = []
		for (let i = 0; i < CommandHandler.commands.specific.length; i++) {
			if (i > 4) break
			const globalspec = CommandHandler.commands.specific.sort(function(a, b) { return (b.count > a.count) ? 1 : ((a.count > b.count) ? -1 : 0) })
			globalUsage.push(`\`${globalspec[i].command}\` ─ used ${globalspec[i].count} times`)
			const guildspec = CommandHandler.commands[message.guild.id].specific.sort(function(a, b) { return (b.count > a.count) ? 1 : ((a.count > b.count) ? -1 : 0) })
			guildUsage.push(`\`${guildspec[i].command}\` ─ used ${guildspec[i].count} times`)
		}

		const embed = new Discord.MessageEmbed()
		embed.setTitle(`Command Information » ${message.author.tag}`)
		embed.setDescription(`${client.util.emoji("info", message.guild)} Here are some statistics on command usage in zBot.\nAll statistics are recorded from the last restart on zBot.`)
		embed.addField("Total Commands (global)", CommandHandler.commands.total, true)
		embed.addField("Command Usage (global)", (globalUsage.join("\n").length < 1 ? "N/A" : globalUsage.join("\n")), true)
		embed.addField("Total Commands (from this guild)", CommandHandler.commands[message.guild.id].total, true)
		embed.addField("Command Usage (from this guild)", (guildUsage.join("\n").length < 1 ? "N/A" : guildUsage.join("\n")), true)
		embed.setColor("#27ae60")
		embed.setFooter(`zBot - Created by ${client.developer.tag}`)
		embed.setTimestamp()
		message.channel.zend({ embed })
	} else {
		const embed = new Discord.MessageEmbed()
			.setTitle(`Information » ${message.author.tag}`)
			.setDescription(`${client.util.emoji("info", message.guild)} Here are some statistics on zBot;`)
			.addField("Discord.js Version", `\`${Discord.version}\``, true)
			.addField("Commands Used", `${CommandHandler.commands.total} (since last restart)`, true)
			.addField("Guilds", bot.broadcastEval("client.guilds.size").join(), true)
			.addField("Channels", bot.broadcastEval("client.channels.size").join(), true)
			.addField("Users", bot.broadcastEval("client.users.size").join(), true)
			.addField("Playing Music in", `${client.lavalink.size < 1 ? "No" : client.lavalink.size} voice channels`, true)
			.addField("Process Uptime", uptime, true)
			.addField("Heartbeat Ping", `${Math.floor(message.client.ping)}ms`, true)
			.addField("Memory Usage", `${Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100} MB`, true)
			.setColor("#27ae60")
			.setFooter(`zBot - Created by ${client.developer.tag}`)
			.setTimestamp()
		message.channel.zend({ embed })
	}
}
