exports.settings = {command: "passbeer", description: "Had a long day at work? Get a beer, or pass a beer to someone else.", usage: "passbeer [user]", throttle: {usages: 3, duration: 7} }
exports.run = (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	if (args.toString() == "") {
		message.zreply(`${client.util.emoji("ok", message.guild)} Here's a beer! :beer:`)
		const filter = m => m.author == message.author
		message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
			.then(collected => {
				if (collected.first().content.toLowerCase().startsWith("make that")) {
					const number = collected.first().content.toLowerCase().split("make that").slice(1)
					message.zreply(`${client.util.emoji("ok", message.guild)} Here's ${number} more beers! :beers:`)
				}
			})
		return
	}

	args = args.toString()
	args = Find.member(args, message.guild).shift()
	if (args == undefined) return `${client.util.emoji("nope", message.guild)} I couldn't find any users under that query.`
	message.guild.members.fetch(args.id).then(function(member) {
		message.channel.zend(`${client.util.emoji("ok", message.guild)} ${message.author} passed ${member.displayName} a beer! Cheers! :beers:`)
	})
}
