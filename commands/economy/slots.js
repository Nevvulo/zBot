exports.settings = {command: "slots", description: "Allows you to bet money to either lose or earn more.", usage: "slots  [amount of money]",
	info: "You are betting with a 12-sided die. If you roll a higher amount than the bot, you win!", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const slots = [
		{icon: "💔", multiplier: 2.2, get jackpot() { return this.multiplier*2 } },
		{icon: "💗", multiplier: 2.4, get jackpot() { return this.multiplier*2 } }, 
		{icon: "💛", multiplier: 2.6, get jackpot() { return this.multiplier*2 } },
		{icon: "💚", multiplier: 2.8, get jackpot() { return this.multiplier*2 } }, 
		{icon: "💙", multiplier: 3.2, get jackpot() { return this.multiplier*2 } }, 
		{icon: "💜", multiplier: 3.5, get jackpot() { return this.multiplier*2 } },
		{icon: "💖", multiplier: 4, get jackpot() { return this.multiplier*2 } }, 
		{icon: "💝", multiplier: 5, get jackpot() { return this.multiplier*2 } },  
		{icon: "🔱", multiplier: 8, get jackpot() { return this.multiplier*2 } } ]
	const Discord = require("discord.js");
	const Economy = new (require("./../../structures/user/Economy.js"));
	const Constants = require("./../../util/Constants.js")
	const profile = (await message.member.profile)
	let bet = Math.floor(Number(args.slice(0).join(" "))) || 50
	if (!bet) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to bet a valid amount of ${Constants.CurrencySettings.name.plural}`)
	if (bet < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't bet a negative amount of ${Constants.CurrencySettings.name.plural}.`)
	if (profile.get("balance") < bet) return message.zreply(`${client.util.emoji("nope", message.guild)} You don't have enough \
${Constants.CurrencySettings.name.plural} to bet this amount.`)
	const generate = () => {
		return slots[Number(Math.floor(Math.random() * slots.length))]
	}
	const slotPositions = {
		top: 	[generate(), generate(), generate()],
		middle: [generate(), generate(), generate()],
		bottom: [generate(), generate(), generate()]
	}
	await Economy.remove(message.member, bet)

	const middle = slotPositions.middle
	let result = 0;
	const amount = middle.reduce((b,c)=>((b[b.findIndex(d=>d.el===c)]||b[b.push({el:c,count:0})-1]).count++,b),[]);
	for (let i in amount) {
		if (amount[i].count > 2) {
			result = amount[i].el.jackpot;
		} else if (amount[i].count > 1) {
			result = amount[i].el.multiplier;
		}
	}
	result = Math.floor(result)
	const payout = result ? Number(bet*result) : 0;
	const gambed = function () {
		let msg = ` \`${slotPositions.top[0].icon}   ${slotPositions.top[1].icon}   ${slotPositions.top[2].icon}\`\n`;
		msg += ` ${slotPositions.middle[0].icon}    ${slotPositions.middle[1].icon}    ${slotPositions.middle[2].icon}\n`
		msg += ` \`${slotPositions.bottom[0].icon}   ${slotPositions.bottom[1].icon}   ${slotPositions.bottom[2].icon}\``

		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Slots » ${message.author.tag}`, message.author.displayAvatarURL())
		embed.setDescription(`${result ? `You won \`${Constants.CurrencySettings.symbol}${payout}\`!` :
			`You lost \`${Constants.CurrencySettings.symbol}${bet}\`.`}\n\n${msg}`)
		embed.setColor("#ffa726")
		return message.channel.zend({ embed })
	}
	gambed();
	if (result) await Economy.add(message.member, payout)
}
