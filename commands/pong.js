exports.run = (client, message, args) => {
	message.channel.send('Ponging...').then(sent => {
		sent.edit(`:warning: **PING!** Xail Bot *(message)* took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond. Heartbeat acknowledgement *(client)* took **__${client.ping}ms__** to respond.`);
	});
	return;
}