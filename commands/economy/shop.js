exports.settings = {command: "shop", description: "Displays the shop and the available items you can buy in zBot.", usage: "shop [type | page]", aliases: ["store"], throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	const Inventory = new (require("./../../structures/user/Inventory.js"))(message.member);
	if (!args[0]) args[0] = 1

	let backgrounds = [];
	for (let i in Object.values(Constants.Items.background)) {
		let current = Object.values(Constants.Items.background)[i];
		if (await Inventory.has(current)) continue;
		backgrounds.push(`**${current.name}** ─ ${Constants.CurrencySettings.symbol}${current.cost}\n*ID* \`${current.id}\` ─ ${current.type.charAt(0).toUpperCase()
		}${current.type.slice(1)}\n`)
	}

	const shop = [backgrounds || null] 
	if (!shop[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You've bought everything in the shop, there are no new items. Congratulations!`);
	new Interface().PaginationMenu(shop[0], {title: `zBot Shop`, author: client.user.displayAvatarURL(),
	 type: "Shop Items", color: "424242", description: `${client.util.emoji("ok", message.guild)} G'day! Here is what is available in the shop right now; \
\nTo see the next page of the shop, type \`${await message.guild.prefix}shop [page number]\`.`, pageLength: 7, delimiter: "\n"}, message, args[0])
}
