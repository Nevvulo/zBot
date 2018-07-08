exports.settings = {command: "redeem", description: "Redeem your donator rewards if you are a patron/donator!", usage: "redeem", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const Discord = require("discord.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	if (!message.author.patron) return message.zreply(`${client.util.emoji("nope", message.guild)} This command is only available to those who have donated in \
the past or are a patron on the zBot patreon page. If you feel that this incorrect, please contact \`${client.developer.tag}\`.`)
	if ((await message.member.profile).get("donator").redeemed) return message.zreply(`${client.util.emoji("nope", message.guild)} You have already redeemed \
your reward on this guild. If you feel that this incorrect, please contact \`${client.developer.tag}\`.`)
	const balance = (await message.member.profile).get("balance");

	const patronAmount = await Economy.patron(message.member, message.author.patron.level)
	const embed = new Discord.MessageEmbed();
	embed.setAuthor(`Donator Redeem » ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setDescription(`${client.util.emoji("ok", message.guild)} Thank you for donating to zBot! It means a lot that you support the work that I (\`${
		client.developer.tag}\`) put into zBot. Enjoy your rewards!`)
	embed.addField(message.author.patron.type, `\`\`\`diff\n+ ${Constants.CurrencySettings.symbol}${patronAmount}\`\`\``)
	embed.setColor("#4caf50")
	return message.channel.zend({ embed })
}
