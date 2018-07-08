exports.settings = {command: "hug", description: "Give a hug to somebody!", usage: "hug [string]", throttle: {usages: 3, duration: 10} }
exports.run = (client, message, args) => {
	const Badges = new(require("./../../structures/user/Badges.js"))(message.member)
	const hug = args.slice(0).join(" ")
	const responses = ["Isn't that just lovely?", "That's so cute!", "Awh! <3", "Love is in the air!"]

	if (hug.includes("jar of dirt")) return message.channel.zend(`${client.util.emoji("nope", message.guild)} Are you silly? Don't hug a jar of dirt!`)

	if (!hug) {
		switch (Math.floor(Math.random() * 1000) % 4) {
		case 0:
			message.channel.zend(`${client.util.emoji("nope", message.guild)} What is love? Clearly you don't know what it is.`)
			break
		case 1:
			message.channel.zend(`${client.util.emoji("nope", message.guild)} Can't find anybody to hug? Here, I'll give you one.`)
			message.channel.zend(`:hugging: **HUG**: ${client.user} hugged ${message.author}. ${responses[Math.floor(Math.random()*responses.length)]}`)
			break
		case 2:
			message.channel.zend(`${client.util.emoji("nope", message.guild)} Come on. Surely someone out there loves you.`)
			break
		case 3:
			message.channel.zend(`${client.util.emoji("nope", message.guild)} You can't hug nothing.`)
			break
		}
		return
	}

	message.channel.zend(`:hugging: ${message.author.toString()} hugged ${hug}. ${responses[Math.floor(Math.random()*responses.length)]}`)
	// Friendship - badge progress
	Badges.incrementProgress("friendship")
}
