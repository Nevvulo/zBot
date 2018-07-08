exports.settings = {command: "balance", description: "Show your balance, or show another users balance.", usage: "balance [user]", aliases: ["bal"], throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	if (!args[0]) args[0] = message.author.id;
	const member = Find.member(args.slice(0).join(' '), message.guild)[0];
	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`);
	const balance = (await member.profile).get("balance");
	return message.zreply(`${client.util.emoji("ok", message.guild)} ${member.id == message.author.id ? "You have" : `${member.displayName} has`} \`${balance}\` ${balance == 1 ?
		Constants.CurrencySettings.name.singular : Constants.CurrencySettings.name.plural}.`)
}
