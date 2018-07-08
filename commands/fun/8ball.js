exports.settings = {command: "8ball", description: "Ask the 8-ball a question and get a random response.", usage: "8ball (question)", throttle: {usages: 3, duration: 7}}
exports.run = (client, message, args) => {
	const responses = [
		"It is certain.",
		"It is decidedly so.",
		"Without a doubt.",
		"Yes, definitely.",
		"You may rely on it.",
		"As I see it, yes.",
		"Most likely.",
		"Outlook is good.",
		"Yes.",
		"Signs point to yes.",
		"Reply hazy, try again later.",
		"Ask again later.",
		"Better not tell you now.",
		"Cannot predict now.",
		"Concentrate and ask again.",
		"Don't count on it.",
		"My reply is no.",
		"My sources say no.",
		"Outlook is not so good.",
		"Very doubtful.",
	]

	args = args.slice(0).join(" ")
	if (!args) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to specify a question/message.`)
	message.channel.zend(`${client.util.emoji("offline", message.guild)} \`${args.replace(/`/g, "`").replace(/\n/g, " ")}\` ─ *Asked by \`${message.author.tag}\`.*\n:8ball: ${responses[Math.floor(Math.random() * responses.length)]}`)
	// replacing the codeblock character with a similar unicode character
}
