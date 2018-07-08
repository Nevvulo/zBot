exports.settings = {command: "equip", description: "Allows you to equip specific items to your profile.", usage: ["equip (item name/id) [slot]", "equip clear", "equip (list (badges | backgrounds))"],
	throttle: {usages: 3, duration: 10}, example: "equip **background** **polymountains**", info: "Parameter **slot** can be \"background\", \"1-6\" or \"weapon\"."}
exports.run = async (client, message, args) => {
	const BadgeStructure = new(require("./../../structures/user/Badges.js"))(message.member)
	const Inventory = new(require("./../../structures/user/Inventory.js"))(message.member)
	const profile = (await message.member.profile)
	const prefix = await message.guild.prefix
	const Shop = require("./../../models/general/Shop.js")
	const Sequelize = require('sequelize')
	const Op = Sequelize.Op
	const item = await Shop.findOne({ where: { id: { [Op.like]: args[0] } } });
	const slot = args[1] || null;

	if (!item) return message.zreply(`${client.util.emoji("nope", message.guild)} That item doesn't exist. \
You can use \`${prefix}items\` to see what items you own.`)

	if (await Inventory.has(item)) {
		switch (item.type) {
			case "background":
				await message.member.update("background", item.id);
				break;

			case "weapon":
				await message.member.update("weapon", item.id);
				break;

			case "badge":
				const profile = (await message.member.profile)
				const inventory = profile.get("inventory");
				let slots = inventory.slots;
				console.log(slots)
				const index = slots.findIndex(e => !e) > 6 || slots.findIndex(e => !e) < 0 
				? 0 
				: slots.findIndex(e => !e);
				slots[index] = item.id
				await message.member.update("slots", Object.assign([null, null, null, null, null, null], slots));
				break;

			default:
				throw "Unknown item type"
		}
		return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully equipped \
\`${item.name}\`!`)
	} else {
		return message.zreply(`${client.util.emoji("nope", message.guild)} You don't own this item. \
You can use \`${prefix}items\` to see what items you own.`)
	}
}
