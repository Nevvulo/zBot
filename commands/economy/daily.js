exports.settings = {command: "daily", description: "Collect your daily cash!", usage: "daily [user]", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Constants = require("./../../util/Constants.js")
	const Duration = require("./../../util/Duration.js")
	const Discord = require("discord.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	if (!args[0]) args[0] = message.author.id;
	const member = Find.member(args.slice(0).join(' '), message.guild)[0];
	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`);

	const daily = (await member.profile).get("daily")
	const now = Date.now();
	const last = daily.received;
	const diff = now - last;
	const next = 86400000 - diff;

	const hours = Math.floor(next / 3600000);
	const minutes = Math.floor((next / 60000) - (hours * 60));
	const seconds = Math.floor((next / 1000) - ((hours * 3600) + (minutes * 60)));

	const timeArr = [{ type: {singular: "hour", plural: "hours"}, amount: hours },
									 { type: {singular: "minute", plural: "minutes"}, amount: minutes },
									 { type: {singular: "second", plural: "seconds"}, amount: seconds } ];
	let properArr = [];

	for (let i in timeArr) {
		if (timeArr[i].amount < 1) continue;
		properArr.push(`${timeArr[i].amount} ${timeArr[i].amount == 1 ? timeArr[i].type.singular : timeArr[i].type.plural}`)
	}
	let timeLeft = properArr.slice(0, -2).join(', ') + (properArr.slice(0, -2).length ? ', ' : '') + properArr.slice(-2).join(' and ');

  if (diff >= 86400000) {
	  	let type = "user";
		const types = {
			"user": true,
			"upvoter": message.author.upvoted,
			"plus": message.author.patron.level == 1,
			"ultra": message.author.patron.level == 2,
			"contributor": Object.keys(client.contributors).includes(message.author.id),
			"developer": message.author.developer	
		}

		for (let [key, value] of Object.entries(types)) {
			if (value) {
				type = key; 
				break;
			}
		}

		const dailyAmount = await Economy.daily(member, type)
		const embed = new Discord.MessageEmbed();
		embed.setAuthor(`Daily » ${member.user.tag}`, member.user.displayAvatarURL())
		embed.setDescription(`${client.util.emoji("ok", message.guild)} ${member.id == message.author.id ? `You have claimed your daily ${Constants.CurrencySettings.name.plural}!` :
		`You have given your daily ${Constants.CurrencySettings.name.plural} to **${member.displayName}**!`}\n\`\`\`diff\n+ ${Constants.CurrencySettings.symbol}${dailyAmount}\`\`\``)
		embed.setColor("#ffa726")
		embed.setFooter(`Streak ─ ${daily.streak} ${type !== "user" ? `| Bonus ${Constants.CurrencySettings.symbol}${Economy.dailyBonus[type]} for being ${
			type == "upvoter" ? "an" : "a"} ${type == "plus" || type == "ultra" ? "donator" : type}` : ""}`, client.user.displayAvatarURL())
		return message.channel.zend({ embed })
	} else {
		return message.zreply(`${client.util.emoji("nope", message.guild)} You need to wait \`${timeLeft}\` before you can claim your daily ${Constants.CurrencySettings.name.plural}.`)
	}
}
