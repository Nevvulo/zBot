exports.settings = {command: "ping", description: "Shows the ping time for zBot.", usage: "ping", throttle: {usages: 4, duration: 10} }
exports.run = (client, message) => {
	const now = Date.now();
	message.channel.zend("Pinging...").then(sent => {
		const pingtime = sent.createdTimestamp - now;
		sent.edit(`${client.util.emoji((pingtime > 300 ? "dnd" : (pingtime > 150 ? "idle" : "online")), message.guild)} **PONG!** zBot *(message)* took **__${pingtime}ms__** to respond. Heartbeat acknowledgement *(client)* took **__${Math.round(client.ping)}ms__** to respond.`)
	})
}
