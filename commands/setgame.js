exports.run = (client, message, args) => {
if (message.author.id == "246574843460321291") {
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

	console.log("Set the game to " + gamemessage);
	presence.game.name = gamemessage;
	client.user.setPresence(presence);
	message.delete()
	message.channel.send(":white_check_mark: **OK:** I successfully set the game to **" + gamemessage + "**. It may take a few seconds to register this change.\n:information_source: Please note that this change is only temporary, as after a while the game will automatically be overwritten by something else.");
} else {
	message.channel.send(":no_entry_sign: **NOPE**: You don't have permission to use this command.")
}
}

let command = 'setgame'
, description = 'Sets the game that the bot is playing to a specific string.'
, usage = 'setgame **[string]**'
, throttle = {usages: 3, duration: 10}
, permission = 'dev';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
