exports.run = (client, message, args) => {

function warningIcon(guild) {
    return ":warning:";
}

	message.channel.send('Pinging...').then(sent => {
		sent.edit((warningIcon(message.guild)) + ` **PONG!** Xail Bot *(message)* took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond. Heartbeat acknowledgement *(client)* took **__${client.ping}ms__** to respond.`);
	});
	return;
}