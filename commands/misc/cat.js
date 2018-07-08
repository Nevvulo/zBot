exports.settings = {command: "cat", description: "Displays a random image of a cat.", usage: "cat", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	const {get} = require("snekfetch")
	const base = "http://78.media.tumblr.com"
	get("http://thecatapi.com/api/images/get").then(response => {
		message.channel.zend(`${client.util.emoji("ok", message.guild)} :cat: **|** *Here is your random cat!*\n${base}${response.request.path}`)
	})
}
