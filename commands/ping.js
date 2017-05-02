exports.run = (client, message, args) => {

function warningIcon(guild) {
    return ":warning:";
}

	if (message.author.id == "246574843460321291") {
	message.channel.send('Ponging...').then(sent => {
		sent.edit((warningIcon(message.guild)) + ` **PONG!** Xail Bot took **__${sent.createdTimestamp - message.createdTimestamp}ms__** to respond.`);
	});
	return;
	}
	

doNotDelete = true;
	switch (Math.floor(Math.random() * 1000) % 5) {

		case 0:
			message.channel.send(warningIcon(message.guild) + ' **PONG!** I want to play pong too... :\'(');
			break;
		case 1:
			message.channel.send(warningIcon(message.guild) + ' **PONG!** I love playing pong!');
			break;
		case 2:
			message.channel.send(warningIcon(message.guild) + ' **PONG!** Thanks for playing pong with me!');
			break;
		case 3:
			message.channel.send(warningIcon(message.guild) + ' **PONG!** Reflect upon this!');
			break;
		case 4:
			message.channel.send(warningIcon(message.guild) + ' **PONG!**');
			break;
	}
}