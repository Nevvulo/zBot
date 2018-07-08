exports.settings = {command: "sell", description: "Allows you to sell an item that you have previously bought from the shop, and earn money back on it", 
usage: "sell (item)", aliases: ["trade"], throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const Shop = require("./../../models/general/Shop.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	const Sequelize = require('sequelize')
	const Op = Sequelize.Op
	const Inventory = new (require("./../../structures/user/Inventory.js"))(message.member);
	const item = await Shop.findOne({ where: { id: { [Op.like]: args.slice(0).join(" ") } } });

	if (!item) return message.zreply(`${client.util.emoji("nope", message.guild)} That item doesn't exist.`);
	if (item.type == "badge") return message.zreply(`${client.util.emoji("nope", message.guild)} You can't sell badges!`);
	if (!await Inventory.has(item)) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't sell an item you don't own.`);
	
	await Inventory.remove(item.dataValues);
	await Economy.add(message.member, item.cost/2)
	message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully sold the item \`${item.name}\`. You no longer own this item, and you have earned \
${item.cost/2} ${Constants.CurrencySettings.name.plural} back.`)
}
