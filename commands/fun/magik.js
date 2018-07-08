exports.settings = {command: "magik", description: "Sprinkle some magic onto any image you want!", usage: "magik (attachment | url)", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const snekfetch = require("snekfetch")
	const text = args.slice(0).join(" ")
	if (!text && !message.attachments.size) return message.zreply(`${client.util.emoji("nope", message.guild)} No image/attachment or URL was provided.`)
	const res = await snekfetch.get(`https://discord.services/api/magik?url=${text || message.attachments.first().url}`)
		.catch(() => {
			return message.zreply(`${client.util.emoji("nope", message.guild)} Unfortunately an error occured whilst trying to improve your image.`)
		})
	return message.channel.zend(`${client.util.emoji("ok", message.guild)} I've sprinkled some magic onto your image.`, {files: [res.body]})
}
