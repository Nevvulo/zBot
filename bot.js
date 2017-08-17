/****************************************
 *
 *   zBot: An all-in-one bot.
 *   Copyright (C) 2017 Victor Tran and Rylan Arbour
 *	 Rewritten and redesigned by zBlake.
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * *************************************/
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const api = require('./data/main/keys/keys.js');
//This is just to make the console look fancier
var colors = require('colors');
const replace = require("replace");
const developer = require('./commands/debug/developer.js');
const events = require('events');
const commandEmitter = new events.EventEmitter();

global.logType = {
    debug: 0,
    info: 1,
    warning: 2,
    critical: 3,
    success: 4
}

global.log = function(logMessage, type = logType.debug) {
    if (type == logType.debug) {
        if (process.argv.indexOf("--debug") == -1) {
            return;
        }
    }

    var logString;
		var logFormatting;
    switch (type) {
        case logType.debug:
            logFormatting = colors.bgMagenta(colors.white("[ DEBUG ]"));
            break;
        case logType.info:
						logString = colors.white(logMessage);
            logFormatting = colors.white("[ INFO ]");
            break;
        case logType.warning:
						logString = colors.yellow(logMessage);
            logFormatting = colors.bgYellow(colors.black("[ WARNING ]"));
            break;
        case logType.critical:
						logString = colors.bgRed(colors.white(logMessage));
            logFormatting = colors.bgRed(colors.white("[ CRITICAL ]"));
            break;
        case logType.success:
						logString = colors.green(logMessage);
            logFormatting = colors.bgGreen(colors.black("[ SUCCESS ]"));
            break;
    }
    console.log(logFormatting, logString);
}

//Maintenance check
var developerMode = false;
if (developer.developerMode == true) {
	developerMode = true;
} else {
	developerMode = false;
}

var moderationEnabled = false;

const panicMode = require('./commands/panic.js');
const debug = require('./commands/debug/toggle.js');
const Experience = require('./structures/profile/Experience.js');
const Version = require('./structures/general/Version.js')
const Spam = require('./structures/general/Spam.js')
Spam.constructor(client, commandEmitter, moderationEnabled);
const Expletive = require('./structures/general/Expletive.js')
Expletive.constructor(client, commandEmitter, moderationEnabled);
const Conversation = require('./structures/general/Conversation.js')
Conversation.constructor(client, commandEmitter);
const Challenge = require('./structures/games/Challenge.js')
Challenge.constructor(client, commandEmitter);
const ExperienceManager = require('./structures/experience/ExperienceManager.js')
ExperienceManager.constructor(client, commandEmitter);
const CommandHandler = require('./structures/general/CommandHandler.js')
CommandHandler.constructor(client, commandEmitter);
const Blacklist = require('./structures/general/Blacklist.js')
Blacklist.constructor(client, commandEmitter);

//Console
var sudoCommand = "";
var currentGuild = "";
var currentChannel = "";

//Misc.
var userAFK = [];
var lockBox = [];
var commandHistory = [];

//Moderation
var doNotDelete = false;
var ignoreMessage = false;

async function setGame() {
	let presence = {};
	presence.game = {};
	presence.afk = false;

	await fs.readFile('./data/main/setGame/setGame.txt', function(err, data){
	if(err) throw err;
	data = data.toString();
	var fileContentLines = data.split( '\n' );
	var randomLineIndex = Math.floor( Math.random() * fileContentLines.length );
	var randomLine = fileContentLines[ randomLineIndex ];
  presence.game.type = 0;
	presence.game.name = randomLine;
	client.user.setPresence(presence);
	})

}

client.on('ready', () => {
	log("> zBot is now online!", logType.success)
	client.setInterval(setGame, 300000);
	setGame();
});


process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', processConsoleInput);

function processConsoleInput(line) {
    commandHistory.unshift(line);
    	text = line.trim();
    	currentGuild = client.guilds.last(); //because zBot is only connected to 1 guild
    	switch (text) {
    		case "stop":
    			log("zBot will now shutdown.", logType.info)
    			process.exit(0);
    			break;
    		case "setchannel":
    			log("Set text channel to nothing.", logType.info)
    			currentChannel = "";
    			break;
    		default:
    			if (text.startsWith("log")) {
    				log(text.substr(4), logType.info);
    			} else if (text.startsWith("setchannel")) {
    				if (currentGuild != "") {
    					currentGuild.channels.forEach(function (channel) {
    						if (channel.name == text.substr(11)) {
    							currentChannel = channel;
    							log("Set text channel to #" + text.substr(11) + ". All messages sent through the 'send' command will be redirected to that channel.", logType.info)
    						}
    					})
    				} else {
    					return;
    				}
    			} else if (text.startsWith("send")) {
    				if (currentChannel != "") {
    					currentChannel.send(text.substr(5))
    				}
    		} else if (text.startsWith("sudo")) {
    			if (currentChannel != "") {
    				currentChannel.send(sudoCommand);
    			}
    		}
    	}
}


function messageChecker(oldMessage, newMessage) {
	var message;

	if (newMessage == null) {
		message = oldMessage;
	} else {
		message = newMessage;
	}
	var msg = message.content;

	if (message.guild == null) return;
  commandEmitter.emit('newMessage', message);

	exports.userAFK = userAFK;
	if (message.mentions.users.size > 0 && message.author.bot == false) {
		if (userAFK.indexOf(message.mentions.users.first().id) > -1) {
			message.reply(":information_source: **" + message.mentions.users.first().username + "** is currently *AFK*. They may not respond to your message for a while.").then(message => {
				message.delete({
					timeout: 8000
				});
			});
		}
	} else {}

	// If panicMode has no value, init to false.
	if (panicMode.enabled == undefined) {
		panicMode.enabled = false;
	}

	// When panic mode is enabled, delete all messages.
	if (panicMode.enabled) {
		message.delete();
	}

	if (message.author.id !== 303017211457568778 && !message.author.bot) {
    	console.log(colors.gray("[ MESSAGE ] " + message.author.username + " » " + msg));
		}
  }
// END OF MESSAGE Function

client.on('message', messageChecker);
client.on('messageUpdate', messageChecker);

client.on('guildMemberAdd', function(guildMember) {
		channel = client.channels.get("345783379397967872");
		let randomjoin = "";
		switch (Math.floor(Math.random() * 1000) % 7) {
			case 0:
				randomjoin = "Please give them a warm welcome!";
				break;
			case 1:
				randomjoin = "Thanks for joining, and we hope you enjoy your stay!";
				break;
			case 2:
				randomjoin = "Thanks for joining us!";
				break;
			case 3:
				randomjoin = "It's great to have you here!";
				break;
			case 4:
				randomjoin = "It's a pleasure to have you here.";
				break;
			case 5:
				randomjoin = "Hope you have had a great day so far!";
				break;
			case 6:
				randomjoin = "Nice to see you!";
				break;
		}
		//channel.send("**" + guildMember + "** has joined our awesome server! *" + randomjoin + "*")

	embed = new Discord.MessageEmbed();
    embed.setAuthor("ᴜꜱᴇʀ ᴊᴏɪɴᴇᴅ »  " + guildMember.user.tag, guildMember.user.avatarURL( {format: 'png'} ));
    embed.setColor("#d16c2e");
    embed.setDescription(":wave: <@" + guildMember.id + "> has joined " + guildMember.guild.name + ".\n")

    var msg = guildMember.user.createdAt.toDateString() + " at " + guildMember.user.createdAt.toLocaleTimeString()
    embed.addField("**User Created**", msg);

	var msg = guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString()
    embed.addField("**User Joined**", msg);
	embed.setFooter("For more information on this user, type +uinfo " + guildMember.user.username + ".");

	channel.send({ embed });
});

client.on('guildMemberRemove', function(guildMember) {
	var channel = client.channels.get("345783379397967872");

	embed = new Discord.MessageEmbed();
    embed.setAuthor("ᴜꜱᴇʀ ǫᴜɪᴛ »  " + guildMember.user.tag, guildMember.user.avatarURL( {format: 'png'} ));
    embed.setColor("#d16c2e");
    embed.setDescription(":wave: <@" + guildMember.id + "> has left " + guildMember.guild.name + ".\n")

    var msg = guildMember.user.tag;
    embed.addField("**Username**", msg);

    var msg = guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString();
    embed.addField("**User Joined**", msg);
	embed.setTimestamp(new Date());

	channel.send({ embed });

});

client.on('messageDelete', function(message) {
  if (`${Date.now() - message.createdTimestamp}` < 1900) return;
	if (message.content.startsWith("+")) return;
  if (message.author.bot) return;
	var channel = client.channels.get("345783379397967872");

	embed = new Discord.MessageEmbed();
    embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag, message.member.user.avatarURL( {format: 'png'} ));
    embed.setColor("#e08743");
    embed.setDescription(":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n")

    var msg = message.cleanContent;
    embed.addField("**Message**", msg);

    var msg = "Message manually deleted by user.\n";
    embed.addField("**Reason**", msg);
	embed.setTimestamp(new Date());

	channel.send({ embed });
});

client.on('messageDeleteBulk', function(messages) {
	var channel = null;
	channel = client.channels.get("345783379397967872");
	if (panicMode[messages.first().guild.id])
		return; //Don't want to be doing this in panic mode!

	//Debugging information.
	if (developerMode == true) {
	channel.send(":page_facing_up: **DEBUG:** BulkDelete function called. Deleted " + messages.size + " messages.");
	}



	if (channel != null) {
		log("▲ " + messages.size + " messages deleted using bulkDelete.", logType.warn);
	}

});

client.on('messageUpdate', function(oldMessage, newMessage) {
	if (oldMessage.cleanContent == newMessage.cleanContent) return; //Ignore
  if (oldMessage.author.bot) return;
  var oldMessageContent = oldMessage.cleanContent;
  if (oldMessage.cleanContent == "") {
    oldMessageContent = "*No message was provided.*";
  }
	var channel = null;
	if (oldMessage.guild != null) {
			channel = client.channels.get("345783379397967872");

		if (channel != null) {

	var channel = client.channels.get("345783379397967872");

	embed = new Discord.MessageEmbed();
    embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴇᴅɪᴛᴇᴅ »  " + oldMessage.author.tag, oldMessage.member.user.avatarURL( {format: 'png'} ));
    embed.setColor("#f4c242");
    embed.setDescription(":pencil: Message by <@" + oldMessage.author.id + "> in <#" + oldMessage.channel.id + "> was edited.\n")

    var msg = oldMessage.cleanContent;
    embed.addField("**Previous Content**", msg);

    var msg = newMessage.cleanContent;
    embed.addField("**Updated Content**", msg);
	embed.setTimestamp(new Date());

	channel.send({ embed });
	return;

		}
	}
});

process.on("unhandledRejection", err => {
	log("[UNCAUGHT PROMISE] " + err.stack, logType.critical);
});


client.login(api.key()).catch(function() {
	log("zBot failed to establish a connection to the server.", logType.critical);
});
