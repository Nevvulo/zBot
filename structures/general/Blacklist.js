const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');

function newMessage(message) {
  if (message.channel.type !== 'text') return;
  var msg = message.content;

  var blacklist = ["ौ"]

  function checkArray(str, arr){
     for(var i=0; i < arr.length; i++){
         if(str.match((".*" + arr[i].trim() + ".*").replace(" ", ".*")))
             return true;
     }
     return false;
  }

if (checkArray(msg, blacklist)) {
  message.delete();
}

}

module.exports = {
    name: "Blacklist",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
  }
