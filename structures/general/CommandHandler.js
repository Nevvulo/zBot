const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
const fs = require('fs');
const Settings = require('./Settings.js');

var errorMessage = "";

function newMessage(message) {
  if (message.channel.type !== 'text') return;
  var msg = message.content;

  // Command handler for bot, mod and debug commands.
	if (msg.toLowerCase().startsWith(Settings.getValue(message.guild, "prefix"))) {
		//Un-comment to activate Lockdown Mode. return message.channel.send(":no_entry_sign: **EMERGENCY**: *zBot* has temporarily been placed in **LOCKDOWN MODE**. Learn more about why this has happened here: https://github.com/zBlakee/zBot/wiki/Lockdown-Mode");
		var command = msg.substr(Settings.getValue(message.guild, "prefix").length).split(" ").slice(0, 1);
    var args = msg.split(" ").slice(1);

		exports.commandIssuer = message.author.id;
		log(message.author.username + " issued command " + command, logType.info);

    try {
    			let commandFile = require(`./../../commands/${command}.js`);
    			// ACE prevention
          if (message.author.id == "246574843460321291") return commandFile.run(client, message, args);
          //IF THE COMMAND BEGINS WITH ., / OR ANOTHER OTHER STRANGE STRING, RETURN
    		if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
    				return message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
    		}

        if (message.author.id !== message.guild.ownerID) {
          if (commandFile.settings.permission == "owner") {
          return message.reply(':no_entry_sign: **NOPE:** Only ' + message.guild.owner.displayName + ' can run this command.');
          }
        } else {
          if (commandFile.settings.permission == "owner") {
          return commandFile.run(client, message, args);
        }
      }


      if (!message.member.roles.has(Settings.getValue(message.guild, "moderatorRole"))) {
        // If command is a moderator command
        if (commandFile.settings.permission == "mod") {
        message.reply(':no_entry_sign: **NOPE:** What? You\'re not a moderator! Why would you be allowed to type that!?');
        } else {
        return commandFile.run(client, message, args);
        }
      }

    		} catch (err) {
    			// ACE prevention
    			if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
    				message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
    			}
    				log(err.stack, logType.warning);
            if (err.toString().includes("module")) { return; } else { callError(err) }
            async function callError(error) {
            await fs.readFile('./data/main/errorHandle/errorMessage.txt', function(err, data){
            if(err) throw err;
            data = data.toString();
            var fileContentLines = data.split( '\n' );
            var randomLineIndex = Math.floor( Math.random() * fileContentLines.length );
            var randomLine = fileContentLines[ randomLineIndex ];

            embed = new Discord.MessageEmbed();
            embed.setAuthor("ᴇʀʀᴏʀ »  ");
            embed.setColor("#991400");
            embed.setDescription(":no_entry_sign: " + randomLine)

            var msg = error;
            embed.addField("**Error Content**", msg);

            embed.setFooter("If you see this message whilst trying to use a command, please DM zBlake#6715.")

            message.channel.send({ embed });
          })
          }
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
