exports.settings = {command: "gamble", description: "Allows you to bet money to either lose or earn more.", usage: "gamble [amount of money]",
	info: "You are betting with a 12-sided die. If you roll a higher amount than the bot, you win!", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js");
	const Economy = new (require("./../../structures/user/Economy.js"));
	const Constants = require("./../../util/Constants.js")
	const profile = (await message.member.profile)
	let bet = Math.floor(Number(args.slice(0).join(" "))) || 50
	if (!bet) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to bet a valid amount of ${Constants.CurrencySettings.name.plural}`)
	if (bet < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't bet a negative amount of ${Constants.CurrencySettings.name.plural}.`)
	if (profile.get("balance") < bet) return message.zreply(`${client.util.emoji("nope", message.guild)} You don't have enough \
${Constants.CurrencySettings.name.plural} to bet this amount.`)
	const roll = {
		bot: Number(Math.floor(Math.random() * 12) + 1),
		user: Number(Math.floor(Math.random() * 12) + 1)
	}

	await Economy.remove(message.member, bet)

	const gambed = function () {
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Gamble » ${message.author.tag}`, message.author.displayAvatarURL())
		embed.setDescription(`${roll.user !== roll.bot ? (roll.user > roll.bot ? `You won \`${Constants.CurrencySettings.symbol}${bet*2}\`!` :
			`You lost \`${Constants.CurrencySettings.symbol}${bet}\`.`) : `You tied with ${client.user.username
			}, quadrupling your bet. You won \`${Constants.CurrencySettings.symbol}${bet*4}\`!`}`)
		embed.addField(`${client.util.emoji(`${roll.user == roll.bot ? "empty" : (roll.user > roll.bot ? "ok" : "nope")}`, 
		message.guild)} ${message.author.tag}`, `Rolled \`${roll.user}\``, true)
		embed.addField(`${client.util.emoji(`${roll.user == roll.bot ? "empty" : (roll.user > roll.bot ? "nope" : "ok")}`, 
		message.guild)} ${client.user.username}`, `Rolled \`${roll.bot}\``, true)
		embed.setColor("#ffa726")
		return message.channel.zend({ embed })
	}

	gambed();
	if (roll.user >= roll.bot) await Economy.add(message.member, bet*2)
	if (roll.user == roll.bot) await Economy.add(message.member, bet*2)
}
