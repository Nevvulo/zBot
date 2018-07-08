exports.settings = {command: "experience", description: "Allows you to manage the experience on your guild and edit other users experience.",
	usage: ["experience set (user) (amount of experience)", "experience add (user) (amount of experience)", "experience remove (user) (amount of experience)", "experience reset"],
	throttle: {usages: 3, duration: 10}, permission: {command: "admin", user: "MANAGE_GUILD"} }
exports.run = async (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const Settings = require("./../../structures/general/Settings.js")
	const subcommand = args[0] || null;
	const number = Math.floor(Number(args[2])) || null;
	const userArgs = args[1] || null;
	const prefix = await message.guild.prefix;
	if (!subcommand) return message.zreply(`${client.util.emoji("nope", message.guild)} The syntax of the command is incorrect. For more information, type \`${prefix}help ${this.settings.command}\``)

	if (subcommand == "reset") {
		message.channel.zend(`${client.util.emoji("warning", message.guild)} You are about to perform a potentially destructive action. Are you sure you want reset the experience systemx? \
All users on this guild will lose all of their experience. *(__y__es | __n__o)*\nOnce this action is completed, **it cannot be undone**.`)

		const filter = m => m.author == message.author
		message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
			.then(async function(collected) {
				if (collected.first().content.toLowerCase().startsWith("y")) {
					await message.member.updateAll("experience", 0)
					return message.channel.zend(`${client.util.emoji("ok", message.guild)} Everyone's experience has been reset to \`0\`.`)
				}
				if (collected.first().content.toLowerCase().startsWith("n")) {
					return message.channel.zend(`${client.util.emoji("ok", message.guild)} I won't reset everyone's experience on this guild.`)
				}
			})
			.catch(collected => {
				if (!collected.size) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} Resetting everyone's experience on this guild won't be completed because you didn't reply with an answer in time.`)
			})
	} else {
		if (!userArgs) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to enter a user to edit their experience. For more information, type \`${prefix}help ${this.settings.command}\``)
		const member = Find.member(userArgs, message.guild)[0]
		if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that query.`)
		if (isNaN(number) || !number) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide a valid experience amount to set for this user.`)
		if (number >= 99999999999999) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided is too high.`)
		if (number <= -1) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided is too low or not valid.`)
		const profile = (await member.profile);
		let experience = Number(profile.get("experience"))
		if (!experience) experience = 1;
		
		let msg = "";
		switch(subcommand) {
			case "set":
				msg = `I've set \`${member.displayName}\`'s experience to \`${number}\`.`
				await member.update("experience", number)
				break;
			case "add":
				if (experience + number > 99999999999999) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided would result in an overflow.`)
				msg = `I've added \`${number}\` experience to \`${member.displayName}\`.`
				await member.update("experience", experience+number)
				break;
			case "remove":
				if (experience - number <= -1) return message.zreply(`${client.util.emoji("nope", message.guild)} The number you've provided would result in negative experience.`)
				msg = `I've removed \`${number}\` experience from \`${member.displayName}\`.`
				await member.update("experience", experience-number)
				break;
			default:
				return message.zreply(`${client.util.emoji("nope", message.guild)} That is not a valid action.`);
		}
		return message.zreply(`${client.util.emoji("ok", message.guild)} ${msg}`)
	}
}
