exports.run = (client, message, args) => {
	message.channel.send('Pinging...').then(sent => {
		sent.edit(`:warning: **PONG!** zBot *(message)* took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond. Heartbeat acknowledgement *(client)* took **__${client.ping}ms__** to respond.`);
	});
	return;
}