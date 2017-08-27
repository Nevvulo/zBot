exports.run = (client, message, args) => {
doNotDelete = true;

var gamemessage = "";
var argsArray = message.content.split(" ").slice(1);
var arrayLength = argsArray.length;
var presence = {};
presence.game = {};
presence.status = "online";
presence.afk = false;

if (arrayLength > 0) {
	for (let i = 0; i < arrayLength; i++) {
		gamemessage = (gamemessage + argsArray[i] + " ");
	}
	gamemessage = gamemessage.trim();
}

message.guild.fetchMember(message.author).then(function(member) {
	console.log("Set the game to " + gamemessage);
	presence.game.name = gamemessage;
	client.user.setPresence(presence);
	message.delete()
	message.channel.send(":white_check_mark: **OK:** I successfully set the game to **" + gamemessage + "**. It may take a few seconds to register this change.\n:information_source: Please note that this change is only temporary, as after a while the game will automatically be overwritten by something else.");
}).catch(function(reason) {
	switch (Math.floor(Math.random() * 1000) % 4) {
		case 0:
			message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
			break;
		case 1:
			message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
			break;
		case 2:
			message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
			break;
		case 3:
			message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
			break;
	}
});
}

let command = 'setgame'
, description = 'Sets the game that the bot is playing to a specific string.'
, usage = 'setgame **[string]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
