exports.settings = {command: "find", description: "Find a user by providing a search query.", usage: "find (user) [page]", permission: {command: "mod", user: "MANAGE_MESSAGES"} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${await message.guild.prefix}help ${this.settings.command}\`.`)
	const hasPageNum = /^\d+$/.test(args[args.length-1])
	let search = args.join(" ")
	if (hasPageNum) search = args.slice(0, -1).join(" ")
	const grabUsers = Find.user(search)
	const users = []
	const pageno = hasPageNum ? args[args.length-1] : 1

	for (const i in grabUsers) {
		users.push(`**${grabUsers[i].tag}** (${grabUsers[i].id}) ${grabUsers[i].bot ? client.util.emoji("bot", message.guild) : ""}`)
	}

	new (require("./../../structures/internal/Interface.js")).Interface().PaginationMenu(users, {title: `Find » ${message.author.tag}`, author: message.author.displayAvatarURL(), type: `Members found under "${search}"`, color: "66bb6a", description: `${client.util.emoji("ok", message.guild)} I found ${users.length
	} members under the query \`${search}\`.`, pageLength: 10, delimiter: "\n"}, message, pageno)
}
