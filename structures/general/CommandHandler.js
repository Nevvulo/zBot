const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');

function newMessage(message) {
  var msg = message.content;
  // Command handler for bot, mod and debug commands.
	if (msg.toLowerCase().startsWith("+")) {

		//Un-comment to activate Lockdown Mode. 	return message.channel.send(":no_entry_sign: **EMERGENCY**: *Xail Bot* has temporarily been placed in **LOCKDOWN MODE**. Learn more about why this has happened here: https://github.com/zBlakee/Xail-Bot/wiki/Lockdown-Mode");
		var command = msg.substr(1).split(" ").slice(0, 1);
		var args = msg.split(" ").slice(1);

		exports.commandIssuer = message.author.id;
		log(message.author.username + " issued command " + command, logType.info);

    try {
    			let commandFile = require(`./../../commands/${command}.js`);
    			// ACE prevention
    			if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
    				message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
    		} else if (message.author.id !== "246574843460321291") {
    			// If command is a moderator command
    			if (command == "mod" || command == "filter" || command == "rm" || command == "uinfo" || command == "warn" || command == "ban" || command == "softban" || command == "mute" || command == "say" || command == "permit" || command == "setgame" || command == "reboot" || command == "cancel") {
    			message.reply(':no_entry_sign: **NOPE:** What? You\'re not a moderator! Why would you be allowed to type that!?');
          return;
    			} else {
    			commandFile.run(client, message, args);
    			}
    		} else {
    			commandFile.run(client, message, args);
    			}
    		} catch (err) {
    			// ACE prevention
    			if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
    				message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
    			}
    				log(err.stack, logType.warning);
    			}
    	}

	// Debug command handler
	if (msg.toLowerCase().startsWith("d+")) {
		if (message.member.roles.find("name", "Admin") || message.guild.ownerID == message.author.id || message.author.id == 246574843460321291 || message.member.roles.find("name", "zBot")) {
			var command = msg.substr(2).split(" ").slice(0, 1);
			var args = msg.split(" ").slice(1);

			log(message.author.username + " issued debug command " + command, logType.info);

			try {
				let commandFile = require(`./../../commands/debug/${command}.js`);
				if (message.author.bot) {
					commandFile.run(client, message, args);
					return;
				}

				if (command == "setexp" || command == "maintenance" || command == "warn" && message.author.bot == false) {
					message.reply(":lock: **INSUFFICIENT PERMISSIONS**: *" + command + "* requires sudo mode to be ran. Type `sudo` in the console to run this command with administrator privileges.");
					sudoCommand = message.content
					return;
			} else {
				commandFile.run(client, message, args);
			}
			} catch (err) {
				log(err.stack, logType.warning);
			}
		} else {
			doNotDelete = false;
			message.reply(':no_entry_sign: **NOPE:** What? You\'re not an administrator! Why would you be allowed to type that!?');
			message.delete();
		}
	}
}



module.exports = {
    name: "CommandHandler",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
