exports.settings = {command: "earn", description: "Shows all the possible ways to earn money in zBot.", usage: "earn", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Constants = require("./../../util/Constants.js")
	const prefix = await message.guild.prefix;
	const embed = new Discord.MessageEmbed()
	embed.setAuthor(`Earn Currency » ${message.author.tag}`, message.author.displayAvatarURL())
	embed.setDescription(`**[${prefix}daily](https://zbot.me/documentation)** ─ \`earn ${Constants.CurrencySettings.symbol}100 (and bonus money for streaks!)\`\n\
**[${prefix}work](https://zbot.me/documentation)** ─ \`earn ${Constants.CurrencySettings.name.plural} as you work, the more you work, the more ${Constants.CurrencySettings.name.plural} you get!)\`\n\
**[Become a patron](https://patreon.com/zbot)** ─ \`earn ${Constants.CurrencySettings.symbol}1000 for every dollar you donate using ${prefix}redeem\`\n\
**[${prefix}blackjack](https://zbot.me/documentation)** ─ \`bet ${Constants.CurrencySettings.name.plural} to play a game of Blackjack, winners earn double of what they bet!\`\n\
**[${prefix}gamble](https://zbot.me/documentation)** ─ \`gamble your ${Constants.CurrencySettings.name.plural} away with dice rolls, winners earn double of what they bet!\`\n\
**[${prefix}sell](https://zbot.me/documentation)** ─ \`if you have any spare items in your inventory, you can sell them back for half of what they were worth\`\n`);
	embed.setColor("#009688")
	return message.channel.zend({ embed });
}
