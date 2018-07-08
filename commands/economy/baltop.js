exports.settings = {command: "baltop", description: "Displays a leaderboard of the users with the highest balance.", usage: ["baltop (list) [page]", "baltop (top) [number 1-10]"],
	throttle: {usages: 3, duration: 10} }
exports.run = async (client, message, args) => {
	const User = require("./../../models/user/User.js")
	const Settings = require("./../../structures/general/Settings.js")
	const Constants = require("./../../util/Constants.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const subcommand = args[0] || "top"
	let limit = (args[1] == undefined ? "" : args[1])
	const memberCountnb = message.guild.members.filter(a => !a.user.bot).array().length

	if (subcommand == "top") {
		if (!limit) limit = 5
		if (memberCountnb < 6) limit = memberCountnb
		if (limit > 10) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't display more than 10 people at a time.`)

		const userProfile = await User.findAll({ where: { guildID: message.guild.id }, attributes: ["userID", "balance"], order: [["balance", "DESC"]], limit: Number(limit) })
		const leaderboard = userProfile.sort((a, b) => b.balance - a.balance)
			.filter(user => client.users.has(user.userID))
			.map((user, position) => `\`${position + 1}\`. **${(client.users.get(user.userID).tag)}** ─ \`${user.balance}\` ${user.balance == 1 ?
				Constants.CurrencySettings.name.singular : Constants.CurrencySettings.name.plural}\n`)

		new Interface().PaginationMenu(leaderboard, {title: `Highest Balance » ${message.guild.name}`, author: message.guild.iconURL(), type: "Top Balance", color: "ffb74d", description: `${client.util.emoji("ok", message.guild)} Here is ` +
	"the users with the highest balance in this guild.", pageLength: limit, delimiter: "\n"}, message, limit)
	} else if (subcommand == "list") {
		const userProfile = await User.findAll({ where: { guildID: message.guild.id }, attributes: ["userID", "balance"], order: [["balance", "DESC"]] })
		const leaderboard = userProfile.sort((a, b) => b.balance - a.balance)
			.filter(user => client.users.has(user.userID))
			.map((user, position) => `\`${position + 1}\`. **${(client.users.get(user.userID).tag)}** ─ \`${user.balance}\` ${user.balance == 1 ?
				Constants.CurrencySettings.name.singular : Constants.CurrencySettings.name.plural}\n`)
		new Interface().PaginationMenu(leaderboard, {title: `Balance Leaderboard » ${message.guild.name}`, author: message.guild.iconURL(), type: "Balance Leaderboard", color: "ffd54f", description: `${client.util.emoji("ok", message.guild)} Here is ` +
	`the balance leaderboard for this guild.\nTo see the next page, type \`${await message.guild.prefix}baltop list [page number]\`.`, pageLength: 10, delimiter: "\n"}, message, limit)
	} else {
		return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${await Settings.getValue(message.guild, "prefix")}help ${this.settings.command}\`.`)
	}
}
