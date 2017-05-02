exports.run = (client, message, args) => {

function warningIcon(guild) {
    return ":warning:";
}

	if (message.author.id == "246574843460321291") {
	message.channel.send('Pinging...').then(sent => {
		sent.edit((warningIcon(message.guild)) + ` **PING!** Xail Bot took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond.`);
	});
	return;
	}
	

doNotDelete = true;
switch (Math.floor(Math.random() * 1000) % 5) {
	
	case 0:
		message.channel.send(warningIcon(message.guild) + ' **PING!** Pings are also cool!');
		break;
	case 1:
		message.channel.send(warningIcon(message.guild) + ' **PING!** Do you like playing pong?');
		break;
	case 2:
		message.channel.send(warningIcon(message.guild) + ' **PING!** Here\'s the test message you wanted!');
		break;
	case 3:
		message.channel.send(warningIcon(message.guild) + ' **PING!** Don\'t breathe this!');
		break;
	case 4:
		message.channel.send(warningIcon(message.guild) + ' **PING!**');
		break;
}
}