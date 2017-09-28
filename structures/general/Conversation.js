const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
const Cleverbot = require('cleverbot');
const api = require('./../../data/main/keys/keys.js')

function newMessage(message) {
  var msg = message.content;
  var conversationMessage = msg.split(" ").slice(1);
  var mention = msg.split(" ").slice(1);
	if (message.author.bot) return;
  // Start a conversation with the bot.
	if (message.mentions !== null) {
		doNotDelete = true;
		// If the message content starts with a mention to zBot, execute conversation code.
		if (msg.startsWith("<@" + client.user.id + ">") || msg.startsWith("<@!" + client.user.id + ">")) {
      if (conversationMessage == "" || conversationMessage == " ") return;

      let clev = new Cleverbot({
        key: api.cleverbot()
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
