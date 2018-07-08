exports.settings = {command: "dadjoke", description: "Gives a random joke, for better or for worse.", usage: "dadjoke", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	const snekfetch = require("snekfetch")
	snekfetch.get("https://icanhazdadjoke.com/")
		.set("Accept", "text/plain")
		.then(res => {
			message.channel.zend(`:rofl: **DAD JOKE**: *${res.text}*`)
		})
}
