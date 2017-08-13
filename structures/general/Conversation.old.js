const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');

function newMessage(message) {
  var msg = message.content;
	if (message.author.bot) return;
  // Start a conversation with the bot.
	if (message.mentions !== null && message.mentions.users !== null && message.author.bot == false) {
		doNotDelete = true;
		// If the message content starts with a mention to zBot, execute conversation code.
		if (msg.toLowerCase().startsWith("<@345766303052857344>")) {

			if (msg.toLowerCase().includes("stop") || (msg.toLowerCase().includes("shut") && msg.toLowerCase().includes("up"))) {

				switch (Math.floor(Math.random() * 1000) % 3) {
					case 0:
						message.reply(":no_entry_sign: **NOPE**: I shall talk as much as I like.");
						break;
					case 1:
						message.reply(":no_entry_sign: **NOPE**: You shu... I'd better not say that actually.");
						break;
					case 2:
						message.reply(":no_entry_sign: **NOPE**: Just no.");
						break;
				}
				//CONVERSATION COMMANDS
			} else if (msg.toLowerCase().includes("fuck you") || msg.toLowerCase().includes("fuck off") || msg.toLowerCase().includes("shit")) {
				message.reply("I didn't ask for this!");
			} else if (msg.toLowerCase().includes("how") && msg.toLowerCase().includes("you")) {
				message.reply("I'm doing OK I suppose.");
			} else if (msg.toLowerCase().includes("yes") || msg.toLowerCase().includes("yep") || msg.toLowerCase().includes("right?") || msg.toLowerCase().includes("isn't it?")) {
				message.reply("Well, I suppose so.");
			} else if (msg.toLowerCase().includes("nah") || msg.toLowerCase().includes("nope")) {
				message.reply("I guess not.");
			} else if (msg.toLowerCase().includes("do you")) {
				message.reply("Erm... Maybe? I dunno.");
			} else if (msg.toLowerCase().includes("what is")) {
				message.reply("It's probably 42.");
      } else if (msg.toLowerCase().includes("are you")) {
				message.reply("If that's what you want, okay.");
			} else if (msg.toLowerCase().includes("why is")) {
				message.reply("I honestly don't know.");
			} else if (msg.toLowerCase().includes("can i")) {
				message.reply("It's up to you, mate.");
			} else if (msg.toLowerCase().includes("hello") || msg.toLowerCase().includes("hey") || msg.toLowerCase().includes("howdy") || msg.toLowerCase().endsWith("hi")) {
				switch (Math.floor(Math.random() * 1000) % 5) {
					case 0:
						message.reply("Is it me you're looking for?");
						break;
					case 1:
						message.reply("Hey there! If you ever need help using Xail Bot, just type `+help`!");
						break;
					case 2:
						message.reply("Hello there!");
						break;
					case 3:
						message.reply("Woah, hey there " + message.author.username + "! Didn't know you were here!");
						break;
					case 4:
						message.channel.send("A wild " + message.author + " appeared!");
						break;
				}

				//USER-SPECIFIC COMMANDS
			} else if (msg.toLowerCase().includes("zblake") || msg.toLowerCase().includes("blake")) {
				message.reply("Oh, I know that guy! He's an absolute legend.");
				//MEME COMMANDS
			} else if (msg.toLowerCase() == "boy i sure do wish i could give money to xailran, he is just such a smart, funny guy that i want to give him funds to help his channel.") {
				message.reply("That is a very specific request you have there!");
			} else if (msg.toLowerCase().includes("+") || msg.toLowerCase().includes("divided") || msg.toLowerCase().includes("-") || msg.toLowerCase().includes("plus") || msg.toLowerCase().includes("subtract") || msg.toLowerCase().includes("minus") || msg.toLowerCase().includes("times") || msg.toLowerCase().includes("*") || msg.toLowerCase().includes("/") || msg.toLowerCase().includes("=")) {
				message.reply("Sorry, I don't know what it is. Go ask Xail, he'd probably know.");
			} else if (msg.toLowerCase().includes("shut down") || msg.toLowerCase().includes("shut off") || msg.toLowerCase().includes("turn off") || msg.toLowerCase().includes("go away") || msg.toLowerCase().includes("shutdown")) {
				message.reply(":white_check_mark: XailBot is now exiting. Goodbye!");
				message.reply("Haha, just kidding.");
			} else if (msg.toLowerCase().includes("but first")) {
				message.reply("We need to talk about parallel universes.");
			}
		}
	}
}


module.exports = {
    name: "Conversation",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
	}
