exports.settings = {command: "say", description: "Say a message under the bot.", usage: "say (message)", throttle: {usages: 4, duration: 10} }
exports.run = (client, message, args) => {
	let includename = false
	let say = args.slice(0).join(" ")
	if (say.indexOf("--in") > -1) {
		say = say.replace("--in", "")
		includename = true
	}
	message.channel.zend((includename ? `${client.util.emoji("edit", message.guild)} **${message.author.tag}** ─ ` : `${String.fromCharCode(0x200B)}`) + say)
}
