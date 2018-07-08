exports.settings = { command: "overwatch", description: "Gives information about a specific Overwatch user.", usage: "overwatch [platform] (region) (battletag)",
	throttle: { usages: 3, duration: 10 }, example: "overwatch us lolrepeatlol#1854", info: "When the `platform` argument is not provided, it defaults to `pc`." }
exports.run = async (client, message, args) => {
	const snekfetch = require("snekfetch")
	const Discord = require("discord.js")
	const prefix = await message.guild.prefix
	const platforms = ["pc", "ps4", "xb"]
	const regions = ["us", "eu", "asia"]
	let region = "us"
	let platform = "pc"
	let tag = ""
	args.forEach((arg) => {
		region = regions.indexOf(arg) > -1 ? arg : region
		platform = platforms.indexOf(arg) > -1 ? arg : platform
		tag = arg.indexOf("#") > -1 ? arg : tag
	})

	if (regions.indexOf(region) == -1) return message.zreply(
		`${client.util.emoji("nope", message.guild)} That's not a valid region. Here is a list of all of the valid regions you can pick from;\n\`${regions.join(", ")}\``
	)
	if (platforms.indexOf(platform) == -1) return message.zreply(
		`${client.util.emoji("nope", message.guild)} That's not a valid platform. Here is a list of all of the valid platforms you can pick from;\n\`${platforms.join(", ")}\``
	)
	if (!tag) return message.zreply(
		`${client.util.emoji("nope", message.guild)} You need to enter a user to search for. For more information, type \`${prefix}help overwatch\`.`
	)

	snekfetch.get(`https://ow-api.com/v1/stats/${platform}/${region}/${tag.replace("#", "-")}/profile`)
		.set("Accept", "application/json")
		.then(res => {
			const info = JSON.parse(res.text)
			if (info.name == undefined) return message.zreply(
				`${client.util.emoji("nope", message.guild)} I couldn't find a user under \`${tag}\`. Try again with a different region, or check your spelling.`
			)
			const embed = new Discord.MessageEmbed()
			embed.setAuthor(`Overwatch ● ${region} ─ ${tag}`, info.icon)
			embed.addField("Name", info.name, true)
			embed.addField("Level", info.level + (info.prestige > 0 ? ` (Prestige ${info.prestige})` : ""), true)
			embed.addField("Skill Rating", (!info.prestige || !info.rating ? "Unranked" : info.rating), true)
			embed.addField("Games Won", `**COMPETITIVE** ─ ${info.competitiveStats.games.won}\n**QUICK PLAY** ─ ${info.quickPlayStats.games.won}`, true)
			embed.addField("Hours Played",
				`**COMPETITIVE** ─ ${info.competitiveStats.games.played}\n**QUICK PLAY** ─ ${info.quickPlayStats.games.played}`, true)
			embed.addField("Eliminations Average",
				`**COMPETITIVE** ─ ${info.competitiveStats.eliminationsAvg}\n**QUICK PLAY** ─ ${info.quickPlayStats.eliminationsAvg}`, true)
			embed.addField("Average Damage Dealt",
				`**COMPETITIVE** ─ ${info.competitiveStats.damageDoneAvg}\n**QUICK PLAY** ─ ${info.quickPlayStats.damageDoneAvg}`, true)
			embed.addField("Average Deaths", `**COMPETITIVE** ─ ${info.competitiveStats.deathsAvg}\n**QUICK PLAY** ─ ${info.quickPlayStats.deathsAvg}`,
				true)
			embed.setThumbnail(info.icon)
			embed.setColor("#ffb300");
			(info.prestige > 0 ? embed.setFooter(`Prestige ${info.prestige}`, info.prestigeIcon) : "")
			message.channel.zend({ embed })
		}).catch(function() {
			return message.zreply(
				`${client.util.emoji("nope", message.guild)} I couldn't find a user under \`${tag}\`. Try again with a different region, or check your spelling.`
			)
		})
}
