exports.run = (client, message, args) => {
	message.channel.send('Pinging...').then(sent => {
		sent.edit(`:warning: **PONG!** zBot *(message)* took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond. Heartbeat acknowledgement *(client)* took **__${client.ping}ms__** to respond.`);
	});
	return;
}

let command = 'ping'
, description = 'Shows the ping time for zBot.'
, usage = 'ping'
, throttle = {usages: 4, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
