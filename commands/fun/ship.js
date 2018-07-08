exports.settings = {command: "ship", description: "Ships you with another random user.", usage: "ship [user]", throttle: {usages: 3, duration: 10} }
exports.run = (client, message, args) => {
	const Find = require("./../../structures/internal/Find.js")
	const user = args.slice(0).join(" ")
	const userGrabbed = Find.member(user, message.guild)[0]
	if (!userGrabbed) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a user under that search.`)

	const properUser2 = (!user ? message.guild.members.random().displayName : userGrabbed.displayName)
	const properUser1 = message.member.displayName
	const choppedUser1 = properUser1.slice(0, Math.floor(properUser1.length / 2))
	const choppedUser2 = properUser2.slice(Math.floor(properUser1.length / 2))
	return message.channel.zend(`:ship: \`${choppedUser1}${choppedUser2}\`   *(**${properUser1} **and** ${properUser2}**)*`)
}
