exports.settings = {command: "badges", description: "View all the badges that are obtainable in zBot as well as the badges you own.", 
usage: ["badges [user]", "badges [info] (badge id)"], throttle: {usages: 3, duration: 10} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Find = require ("./../../structures/internal/Find.js")
	const BadgeStructure = new(require("./../../structures/user/Badges.js"))(message.member)

	if (args[0] == "info") {
		const badgetext = args[1]
		const badge = BadgeStructure.get(badgetext)
		if (!badge) return message.zreply(`${client.util.emoji("nope", message.guild)} That is not a valid badge nI.`)
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Badges » ${message.author.tag}`, message.author.avatarURL())
		embed.setDescription(`${client.util.emoji("info", message.guild)} Information about \`${badge.name}\``)
		embed.setColor("#ffb300")
		embed.addField("Description", badge.description)
		if (badge.levels) {
			let msg = ""
			for (const key in badge.levels) {
				msg += `\`Level ${key}\` ─ \`${badge.levels[key]}\`\n`
			}
			const level = await BadgeStructure.getLevel(badge.id)
			embed.addField("Levels", `${msg}${level ? `\n*You are currently at level \`${level}\` on this badge.*` : ""}`)
		}
		return message.channel.zend({ embed })
	}

	let search = args.join(" ")
	if (!search) search = message.author.id
	const member = (search == message.author.id ? message.member : Find.member(args.join(" "), message.guild)[0])
	if (!member) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a member under that query.`)
	const page = (member.id == message.author.id ? args[0] : args[1])

	const tosend = []
	const badges = BadgeStructure.all
	for (const i in badges) {
		const value = badges[i]
		let msg = "";
		msg += client.util.emoji(await BadgeStructure.has(value.id) ? "ok" : "nope", message.guild)
		msg += ` \`${value.name}\` ─ *ID* \`${value.id}\``
		tosend.push(msg)
	}
	if (tosend.length < 1) return message.zreply(`${client.util.emoji("incomplete", message.guild)} You don't own any badges.`)
	new (require("./../../structures/internal/Interface.js")).Interface().PaginationMenu(tosend, {title: `Badges » ${member.user.tag}`, author: member.user.displayAvatarURL(), type: "Badges", color: "66bb6a", description: `${client.util.emoji("ok", message.guild)} Here is a list of all the collectable badges within zBot.\n` +
  `You can use \`${await message.guild.prefix}badges list [page number] to see the next page.\``, pageLength: 10, delimiter: "\n"}, message, page)
	return
}
