exports.settings = {command: "lewdneko", description: "Shows a picture of a neko from `nekos.life`", usage: "lewdneko", throttle: {usages: 3, duration: 10} }
exports.run = (client, message) => {
	const loading = ["Just a moment...", "Lewding it up...", "Getting prepared...", "One second...", "Grabbing image...", "Getting lewd..."]
	message.channel.zend(`${client.util.emoji("loading", message.guild)} ${loading[Math.floor(Math.random()*loading.length)]}`).then(mes => {
		const snekfetch = require("snekfetch")
		snekfetch.get("https://nekos.life/api/v2/img/lewd")
			.set("Accept", "application/json")
			.then(res => {
				mes.edit(`${client.util.emoji("ok", message.guild)} Here's your ~lewd~ neko!\n${JSON.parse(res.text).url}`)
			})
	})
}
