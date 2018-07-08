exports.settings = {command: "items", description: "View all of the items that you own on this guild.", usage: ["items [page]", "items [category] [page]"],
	throttle: {usages: 3, duration: 10} }
exports.run = async (client, message, args) => {
	const Inventory = new(require("./../../structures/user/Inventory.js"))(message.member)
	const { Interface } = require("./../../structures/internal/Interface.js")
	const Constants = require("./../../util/Constants.js")
	if (!args[0]) args[0] = 1
	const userItems = await Inventory.all;
	const items = [];
	console.log(userItems)
	for (let i of userItems) {
		items.push(`**${i.name}** ─ *ID* \`${i.id}\` ─ ${i.type.charAt(0).toUpperCase()}${i.type.slice(1)}\n`)
	}

	if (items < 1) return message.zreply(`${client.util.emoji("empty", message.guild)} You have no items to show on this guild. Try \`${await message.guild.prefix}shop\` \
to see the different items you can buy!`)
	new Interface().PaginationMenu(items, {title: `Items » ${message.author.tag}`, author: message.author.displayAvatarURL(), type: "Owned Items", color: "ffb74d",
	description: `${client.util.emoji("ok", message.guild)} Here is a list of all the items that you own.`, pageLength: 7, delimiter: "\n"}, message, args[0])
}
