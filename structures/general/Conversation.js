const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
const Cleverbot = require('cleverbot');

function newMessage(message) {
  var msg = message.content;
  var conversationMessage = msg.split(" ").slice(1);
	if (message.author.bot) return;
  // Start a conversation with the bot.
	if (message.mentions !== null && message.mentions.users !== null && message.author.bot == false) {
		doNotDelete = true;
		// If the message content starts with a mention to zBot, execute conversation code.
		if (msg.toLowerCase().startsWith("<@345766303052857344>")) {
      let clev = new Cleverbot({
        key: 'CC3uiABdbt8rybKAicAPK7FuoSw'
      });

      clev.query(conversationMessage)
      .then(function (response) {
        message.reply(response.output);
      });
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
