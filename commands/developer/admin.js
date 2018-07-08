exports.run = async (client, message, args) => {
	let answered = false
	const Discord = require("discord.js")
	const Settings = require("./../../structures/general/Settings.js")
	const filter = m => m.author == message.author
	const moment = require("moment")
	require("moment-duration-format")
	const os = require("os")
	const uptime = moment.duration(process.uptime() * 1000, "milliseconds").format("D [days], H [hrs], m [mins], s [secs]")
	const Tags = require("./../../models/general/Tags.js")

	if (args[0] == "override") { // toggle override
		answered = true
		const toggle = Settings.toggleDeveloperOverride()
		message.channel.zend(`${client.util.emoji("ok", message.guild)} ${toggle == true ? "You are now overriding commands as a developer." : "Developer overrides for commands have been turned off."}`)
		return
	}
	if (args[0] == "shutdown") { // exit
		message.channel.zend(`${client.util.emoji("warning", message.guild)} Are you sure you want to shutdown zBot? (__y__es / __n__o)` +
	`\n\`\`\`${client.lavalink.size} voice connections will be terminated.\n${uptime} of uptime will be lost.\nSome people may get angry.\`\`\``)
		message.channel.awaitMessages(filter, { max: 1 })
			.then(projected => {
				if (projected.first().content.toLowerCase().startsWith("y")) {
					message.channel.zend(`${client.util.emoji("ok")} Gah! Byte form is so last week!`).then(re => {
						process.exit(0)
					})
				} else if (projected.first().content.toLowerCase().startsWith("n")) {
					return message.channel.zend(`${client.util.emoji("ok")} I won't shutdown.`)
				}
			})
		return
	}
	if (args[0] == "badge") { // badge
		message.zreply(`${client.util.emoji("edit", message.guild)} **APPLY BADGE**: Apply a badge to someone using \`[guild | this] [user id] [badge name]\`.`)
		message.channel.awaitMessages(filter, { max: 1 })
			.then(async (collectedBadge) => {
				let guild = (collectedBadge.first().content.toUpperCase().split(" ")[0] == "this" ? message.guild.id : collectedBadge.first().content.split(" ")[0])
				const userID = collectedBadge.first().content.toUpperCase().split(" ")[1]
				const badge = collectedBadge.first().content.split(" ")[2]
				try {
					const newguild = client.guilds.get(guild);
					const member = await newguild.members.fetch(userID);
					const Badges = new (require("./../../structures/user/Badges.js"))(newguild.members.get(userID));
					Badges.add(badge)
				} catch (err) {
					message.zreply(`${client.util.emoji("nope", message.guild)} ${err}`)
				}
				message.channel.zend(`${client.util.emoji("ok", message.guild)} **${client.users.get(userID).tag}** now has the \`${badge.toUpperCase()}\` badge in ${client.guilds.get(guild).name}`)
				return
			})
	}
	if (args[0] == "presence") { // presence
		message.zreply(`${client.util.emoji("edit", message.guild)} **SETGAME**: What do you want to set the game to?`)
		message.channel.awaitMessages(filter, { max: 1 })
			.then(collectedSetgame => {
				const presence = {}
				const statusArray = ["PLAYING", "STREAMING", "LISTENING", "WATCHING"]
				const name = (statusArray.indexOf(collectedSetgame.first().content.toUpperCase().split(" ")[0]) == -1 ? collectedSetgame.first().content.split(" ").slice(0).join(" ") : collectedSetgame.first().content.split(" ").slice(1).join(" "))
				const type = (statusArray.indexOf(collectedSetgame.first().content.toUpperCase().split(" ")[0]) == -1 ? "PLAYING" : collectedSetgame.first().content.toUpperCase().split(" ")[0])
				presence.activity = {}
				presence.afk = false
				presence.activity.type = type
				presence.activity.name = name
				client.user.setPresence(presence)
				message.channel.zend(`${client.util.emoji("ok", message.guild)} **OK:** I successfully set the game to **${name}**. It may take a few seconds to register this change.`)
			})
	}

	if (args[0] == "cooldown") { // cooldowns
		message.zreply(`${client.util.emoji("edit", message.guild)} **EDIT COOLDOWN**: Edit/end a cooldown using \`[guild | this] [user id | this] [work | daily]\`.`)
		message.channel.awaitMessages(filter, { max: 1 })
			.then(async (collected) => {
				let guild = (collected.first().content.split(" ")[0] == "this" ? message.guild.id : collected.first().content.split(" ")[0])
				const userID = (collected.first().content.split(" ")[1] == "this" ? message.author.id : collected.first().content.split(" ")[1])
				const cooldownToEnd = collected.first().content.split(" ")[2]
				try {
					const newguild = client.guilds.get(guild);
					const member = await newguild.members.fetch(userID);
					switch (cooldownToEnd) {
						case "work":
							let work = (await member.profile).get("work");
							await member.update("work", {lastWorked: 0, hoursWorked: work.hoursWorked, salary: work.salary})
							break;
						
						case "daily":
							let daily = (await member.profile).get("daily");
							await member.update("daily", {streak: daily.streak, received: 0})
							break;
					}
				} catch (err) {
					message.zreply(`${client.util.emoji("nope", message.guild)} ${err}`)
				}
				message.channel.zend(`${client.util.emoji("ok", message.guild)} **${client.users.get(userID).tag}** no longer has a cooldown on \`${cooldownToEnd}\``)
				return
			})
	}
}

let command = "admin"
	, description = "Administrative command"
	, usage = "admin"
	, throttle = {usages: 3, duration: 10}
	, category = "DEV"
	, permission = "dev"
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission, category: category}
