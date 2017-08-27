const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const Settings = require('./Settings.js');

var lastMessages = {};
var fastMessage = {};
var fastMessageCount = {};
var sameMessageCount = {};

function newMessage(message) {
  if (message.channel.type !== 'text') return;
  if (Settings.getValue(message.guild, "spamFilter") == false) return;
	if (message.author.bot) return;
	var msg = message.content

	// Is the first word in message content found more than [x] times?
	function regexEscape(str) {
		if (str == null)
			return;
		return str.toString().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	function reg(input) {
		var flags;
		//could be any combination of 'g', 'i', and 'm'
		flags = 'gi';

		if (input == null)
			return;
		input = regexEscape(input);

		return new RegExp('[a-zA-Z ](' + input + '){10,}', flags);
	}

	//This below code is testing how many characters in a single post, and if there are more than 17 (subject to change) then delete message.
	//Check for spam in a single message
	if (/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?(.)\9{32,}[^0-9]/gi.test(msg) == true) {
		caughtSpam = true;
		message.delete()
		return;
	} else if (reg(msg.match(/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?^(\S+)\s/gi)) !== undefined) {
		if (reg(msg.match(/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?^(\S+)\s/gi)).test(msg) == true) {
			ignoreMessage = true;
			message.delete()
			return;
		}
	}

              //Spam limiting
            if (lastMessages[message.author.id] != msg) {
            sameMessageCount[message.author.id] = 0;
            }

            if (message.content.length < 1) {
            return;
            }
            lastMessages[message.author.id] = msg
            sameMessageCount[message.author.id] += 1;

                if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 3) {
                    if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] == 6) {
											message.reply("Quite enough of this. I'm not warning you anymore.")
                      if (client.channels.has(Settings.getValue(message.guild, "modLogsChannel"))) {
                          channel = client.channels.get(Settings.getValue(message.guild, "modLogsChannel"));
                      } else {
                          log("Moderation logging channel " + Settings.getValue(message.guild, "modLogsChannel") + " not found", logType.critical);
                          return;
                      }
											channel.send({
												embed: {
													color: 14714691,
													author: {
														name: "ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag,
														icon_url: message.member.user.displayAvatarURL
													},
													description: ":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n",
													fields: [{
															name: '**Message**',
															value: message.cleanContent
														},
														{
															name: '**Reason**',
															value: "Spamming.\n"
														}
													],
													timestamp: new Date()
												}
											});
                    } else if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 6) {
                    message.delete();
                    return;
                    } else {
                        //warning messages
												log("▲ Spam limits activated for " + message.author.tag, logType.info);
												switch (Math.floor(Math.random() * 1000) % 6) {
													case 0:
														message.reply("Well... We all heard you.").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 1:
														message.reply("Stop typing the same thing! You're like a broken record!").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 2:
														message.reply("Hmm... Not sure if you'd actually say the same thing more than three times in public.").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 3:
														message.reply("Is that the only phrase you know? Can you try typing something else?").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 4:
														message.reply("Pollution is not the solution, my friend.").then(message => {
														message.delete({
															timeout: 8000
														});
														})
														break;
													case 5:
														message.reply("Can't you think of anything else to say?").then(message => {
														message.delete({
															timeout: 8000
														});
													})
														break;
                    }
									}
									message.delete();
                }
}


module.exports = {
    name: "Spam",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
