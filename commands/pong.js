exports.run = (client, message, args) => {
	message.channel.send('Ponging...').then(sent => {
		sent.edit(`:warning: **PING!** zBot *(message)* took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond. Heartbeat acknowledgement *(client)* took **__${client.ping}ms__** to respond.`);
	});
	return;
}

let command = 'pong'
, description = 'Shows the ping time for zBot.'
, usage = 'pong'
, throttle = {usages: 4, duration: 10}
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
