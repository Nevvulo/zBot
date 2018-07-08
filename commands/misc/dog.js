exports.settings = {command: "dog", description: "Displays a random image of a dog.", usage: "dog", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	const {get} = require("snekfetch")
	get("https://random.dog/woof.json").then(res => {
		message.channel.zend(`${client.util.emoji("ok", message.guild)} :dog: **|** *Here is your random dog!*\n${res.body.url}`)
	})
}
