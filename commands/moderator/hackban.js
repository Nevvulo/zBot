exports.settings = {command: "hackban", description: "Bans a user who isn't present in this guild.", usage: "hackban (user id)", throttle: {usages: 3, duration: 10},
	permission: {command: "mod", user: "BAN_MEMBERS"} }
	exports.run = async (client, message, args) => {
		const Find = require("./../../structures/internal/Find.js")
		const id = args.slice(0).join(" ")
		const user = await client.users.fetch(id);
		const prefix = await message.guild.prefix
		if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter the ID of a user to hackban. See \`${prefix}help hackban\` for more information.`)
		if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.zreply(`${client.util.emoji("nope", message.guild)} I don't have permission to hackban this person. Make sure I have the \`BAN_MEMBERS\` permission and try again.`)
		const banList = await message.guild.fetchBans()
		if (!banList) throw "Ban list not retrievable"
		const banned = banList.has(user.id)
		if (banned) return message.zreply(`${client.util.emoji("nope", message.guild)} That user is already banned!`)
		message.guild.members.ban(user, { days: 7, reason: `Hackbanned by ${message.author.tag}`}).catch(c => {
			throw c;
		}).then(t => {
			message.zreply(`${client.util.emoji("ok", message.guild)} \`${user.tag}\` has been \`banned\` from this server.`)
		})
	}
