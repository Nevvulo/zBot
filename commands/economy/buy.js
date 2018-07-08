exports.settings = {command: "buy", description: "Allows you to buy an item by it's name/ID from the shop.", usage: "buy [item name/id]", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const Shop = require("./../../models/general/Shop.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	const Sequelize = require('sequelize')
	const Op = Sequelize.Op
	const Inventory = new (require("./../../structures/user/Inventory.js"))(message.member);
	const item = await Shop.findOne({ where: { id: { [Op.like]: args.slice(0).join(" ") } } });

	if (!item) return message.zreply(`${client.util.emoji("nope", message.guild)} That item doesn't exist. Try \`${await message.guild.prefix}shop\` \
to see the different items you can buy!`);
	if (await Inventory.has(item)) return message.zreply(`${client.util.emoji("nope", message.guild)} You already own this item.`);
	const balance = (await message.member.profile).get("balance");
	if (item.cost > balance) return message.zreply(`${client.util.emoji("nope", message.guild)} You need \`${item.cost-balance}\` \
more ${Constants.CurrencySettings.name.plural} to purchase \`${item.name}\`.`);

console.log(item.dataValues)
	await Inventory.add(item.dataValues);
	await Economy.remove(message.member, item.cost)
	message.zreply(`${client.util.emoji("ok", message.guild)} Great success! You've just purchased \`${item.name}\`.`)
}
