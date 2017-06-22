exports.run = (client, message, args) => {
	switch (Math.floor(Math.random() * 1000) % 5) {

		case 0:
			message.channel.send(":tada: Where's the cake!?");
			break;
		case 1:
			message.channel.send(":tada: ok baddy");
			break;
		case 2:
			message.channel.send(":tada: Happy birthday!");
			break;
		case 3:
			message.channel.send(":tada: So tonight I'm gonna party like it's 1999!");
			break;
		case 4:
			message.channel.send(":tada: It's that time of the year, when you get older!");
			break;
	}
}