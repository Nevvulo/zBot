exports.settings = {command: "economy", description: "Allows you to manage the economy on your guild and edit other users currency.",
	usage: ["economy set (user) (amount of money)", "economy add (user) (amount of money)", "economy remove (user) (amount of money)", "economy reset"],
	throttle: {usages: 3, duration: 10}, permission: {command: "admin", user: "MANAGE_GUILD"} }
exports.run = async (client, message, args) => {
	const User = require("./../../models/user/User.js")
	const Constants = require("./../../util/Constants.js")
	const Economy = new (require("./../../structures/user/Economy.js"));
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const subcommand = args[0] || null;
	const number = Math.floor(Number(args[2])) || null;
	const userArgs = args[1] || null;
	const prefix = await message.guild.prefix;
	if (!subcommand) return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${prefix}help ${this.settings.command}\``)
	
	if (subcommand == "reset") {
		message.channel.zend(`${client.util.emoji("warning", message.guild)} You are about to perform a potentially destructive action. Are you sure you want reset the entire economy system? \
All users on this guild will lose all of their money. *(__y__es | __n__o)*\nOnce this action is completed, **it cannot be undone**.`)

		const filter = m => m.author == message.author
		message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
			.then(async function(collected) {
				if (collected.first().content.toLowerCase().startsWith("y")) {
					await message.member.updateAll("balance", 100)
					await message.member.updateAll("work", {
						hoursWorked: 0.5,
						salary: 11,
						lastWorked: null
					})
					await message.member.updateAll("daily", {
						streak: 0,
						received: null
					})
					return message.channel.zend(`${client.util.emoji("ok", message.guild)} The economy on this guild has been reset to default settings. All users have lost their ${
						Constants.CurrencySettings.name.plural}.`)
				}
				if (collected.first().content.toLowerCase().startsWith("n")) {
					return message.channel.zend(`${client.util.emoji("ok", message.guild)} I won't reset the economy on this guild.`)
				}
			})
			.catch(collected => {
				console.log(collected)
				if (!collected.size) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} Resetting the economy on this guild won't be completed because you didn't reply with an answer in time.`)
			})
	} else {
		if (!userArgs) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to edit their balance. For more information, type \`${prefix}help ${this.settings.command}\``)		
		const member = Find.member(userArgs, message.guild)[0]
		if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that query.`)
		if (isNaN(number) || !number) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide a valid currency amount to set for this user.`)
		if (number >= 99999999999999) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided is too high.`)
		if (number <= -1) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided is too low or not valid.`)
		const profile = (await member.profile);

		let msg = "";
		switch(subcommand) {
			case "set":
				msg = `I've set \`${member.displayName}\`'s balance to \`${Constants.CurrencySettings.symbol}${number}\`.`
				break;
			case "add":
				if (profile.get("balance") + number > 99999999999999) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided would result in an overflow.`)
				msg = `I've added \`${Constants.CurrencySettings.symbol}${number}\` to \`${member.displayName}\`.`
				break;
			case "remove":
				if (profile.get("balance") - number < 0) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided would result in negative money.`)
				msg = `I've removed \`${Constants.CurrencySettings.symbol}${number}\` from \`${member.displayName}\`.`
				break;
			default:
				return message.zreply(`${client.util.emoji("nope", message.guild)} That is not a valid action.`);
		}
		await Economy[subcommand](member, number)
		return message.zreply(`${client.util.emoji("ok", message.guild)} ${msg}`)
	}
}
