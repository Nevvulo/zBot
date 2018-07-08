exports.settings = {command: "give", description: "Show your generosity and give another user some money!", usage: "give (user) (amount)", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	const balance = (await message.member.profile).get("balance");

	if (!args[0]) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide a user to give money to.`);
	const member = Find.member(args[0], message.guild)[0];
	if (message.member == member) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't give yourself money!`)
	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`);

	const amount = Math.floor(Number(args[1])) || null
	if (!amount) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide an amount of money that you want to give.`)
	if (amount < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't give negative amounts of money!`)
	if (amount > balance) return message.zreply(`${client.util.emoji("nope", message.guild)} You don't have that amount of money to give to this person!`)

	await Economy.add(member, amount); //add amount to receiver
	await Economy.remove(message.member, amount); //remove amount from giver
	return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully given \`${Constants.CurrencySettings.symbol}${amount}\` to \
\`${member.displayName}\`!`)
}
