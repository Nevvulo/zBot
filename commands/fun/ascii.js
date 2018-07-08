exports.settings = {command: "ascii", description: "Turns your text into a large ASCII formation.", usage: "ascii (text)", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const snekfetch = require("snekfetch")
	const text = args.slice(0).join(" ")
	if (!text) return message.zreply(`${client.util.emoji("nope", message.guild)} Your message is too short to be converted to ASCII.`)
	if (text.length > 128) return message.zreply(`${client.util.emoji("nope", message.guild)} Your message is too long to be converted to ASCII.`)
	const res = await snekfetch.get(`http://artii.herokuapp.com/make?text=${text}`)
		.set("Accept", "text/plain")
		.catch(() => {
			message.zreply(`${client.util.emoji("nope", message.guild)} An error occured whilst ASCII-ifying the text. Please try again later.`)
		})
	message.channel.zend(`${client.util.emoji("ok", message.guild)} Here is your ASCII art with the text \`${text}\`;\n\`\`\`${res.text}\`\`\``)
}
