const fs = require('fs');
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite');

exports.run = (client, message, args) => {
	var messagesay = "";
	var randsay = "";
	var argsArray = message.content.split(" ").slice(1);
	var arrayLength = argsArray.length;

	message.delete();

	if (arrayLength > 0) {
		for (let i = 0; i < arrayLength; i++) {
			messagesay = (messagesay + argsArray[i] + " ");
		}
		messagesay = messagesay.trim();
	}

	switch (Math.floor(Math.random() * 1000) % 4) {
	case 0:
		randsay = "Isn't that just lovely?";
		break;
	case 1:
		randsay = "That's so cute!";
		break;
	case 2:
		randsay = "Awh! <3";
		break;
	case 3:
		randsay = "Love is in the air!";
		break;
	}

	if (messagesay.includes("@everyone") || messagesay.includes("@here")) {
		message.channel.send(":no_entry_sign: **NOPE:** You can't ping everyone!");
		return;
	}

	if (messagesay.includes("jar of dirt")) {
		message.channel.send(":no_entry_sign: **NOPE:** Are you silly? Don't hug a jar of dirt!");
		return;
	}

	if (messagesay == "") {
		switch (Math.floor(Math.random() * 1000) % 4) {
		case 0:
			message.channel.send(":no_entry_sign: **NOPE:** What is love? Clearly you don't know what it is.");
			break;
		case 1:
			message.channel.send(":no_entry_sign: **NOPE:** Can't find anybody to hug? Here, I'll give you one.");
			message.channel.send(":hugging: **HUG:** " + client.user + " hugged " + message.author + ". " + randsay);
			break;
		case 2:
			message.channel.send(":no_entry_sign: **NOPE:** Come on. Surely someone out there loves you.");
			break;
		case 3:
			message.channel.send(":no_entry_sign: **NOPE:** You can't hug nothing.");
			break;
		}
		return;
	}

	message.channel.send(":hugging: **HUG:** " + message.author + " hugged " + messagesay + ". " + randsay);

	//Friendship badge
	sql.get(`SELECT * FROM badges WHERE userId ='${message.author.id}' AND guild = '${message.guild.id}'`).then(row => {
		sql.run(`UPDATE badges SET friendship = 1 WHERE userId = ${message.author.id} AND guild = ${message.guild.id}`);
	});
}

let command = 'hug'
, description = 'Give a hug to somebody!'
, usage = 'hug **[string]**'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
