exports.settings = {command: "leaderboard", description: "Displays a leaderboard of the users with the highest ranking experience.", usage: ["leaderboard (list) [page]", "leaderboard (top) [number 1-10]"],
	throttle: {usages: 3, duration: 10} }
exports.run = async (client, message, args) => {
	const User = require("./../../models/user/User.js")
	const Settings = require("./../../structures/general/Settings.js")
	const Experience = require("./../../structures/user/Experience.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const subcommand = args[0] || "top"
	let limit = (args[1] == undefined ? "" : args[1])
	const memberCountnb = message.guild.members.filter(a => !a.user.bot).array().length

	if (subcommand == "top") {
		if (!limit) limit = 5
		if (memberCountnb < 6) limit = memberCountnb
		if (limit > 10) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't display more than 10 people at a time.`)

		const userProfile = await User.findAll({ where: { guildID: message.guild.id }, attributes: ["userID", "experience"], order: [["experience", "DESC"]], limit: Number(limit) })
		const leaderboard = userProfile.sort((a, b) => b.experience - a.experience)
			.filter(user => client.users.has(user.userID))
			.map((user, position) => `\`${position + 1}\`. **${(client.users.get(user.userID).tag)}** ─ ${user.experience} experience\nLevel ${Experience.getLevelFromExp(user.experience)} ─ ` +
			`*${Experience.getLevelBounds(Experience.getLevelFromExp(user.experience)).upperBound - user.experience} exp. until next level*\n`)

		new Interface().PaginationMenu(leaderboard, {title: `Top Experience » ${message.guild.name}`, author: message.guild.iconURL(), type: "Top Experience", color: "ffb74d", description: `${client.util.emoji("ok", message.guild)} Here is ` +
	"the users with the most experience in this guild.", pageLength: limit, delimiter: "\n"}, message, limit)
	} else if (subcommand == "list") {
		const userProfile = await User.findAll({ where: { guildID: message.guild.id }, attributes: ["userID", "experience"], order: [["experience", "DESC"]] })
		const leaderboard = userProfile.sort((a, b) => b.experience - a.experience)
			.filter(user => client.users.has(user.userID))
			.map((user, position) => `\`${position + 1}\`. **${(client.users.get(user.userID).tag)}** ─ ${user.experience} experience\n`)
		new Interface().PaginationMenu(leaderboard, {title: `Leaderboard » ${message.guild.name}`, author: message.guild.iconURL(), type: "Experience Leaderboard", color: "ffd54f", description: `${client.util.emoji("ok", message.guild)} Here is ` +
	`the experience leaderboard for this guild.\nTo see the next page, type \`${await message.guild.prefix}leaderboard list [page number]\`.`, pageLength: 10, delimiter: "\n"}, message, limit)
	} else {
		return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${await Settings.getValue(message.guild, "prefix")}help ${this.settings.command}\`.`)
	}
}
