const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const colors = require('colors');
const fs = require('fs');
const millionaire = require('./../../commands/wwtbb.js');

var q = "";
var a1 = "";
var a2 = "";
var a3 = "";
var a4 = "";
var cA = "";

function newMessage(message) {
    if (message.author.bot) return;
    var msg = message.content;
    var args = msg.split(" ").slice(1);
    var host = millionaire.host

    var answer = "";
    var argsArray = message.content.split(" ").slice(1);
    var arrayLength = argsArray.length;

    if (arrayLength > 1) {
      for (let i = 0; i < arrayLength; i++) {
        answer = (answer + argsArray[i] + " ");
      }
      answer = answer.replace(argsArray[0], "");
      answer = answer.trim();
    }


    //SETTING UP QUESTION
    if (msg.toLowerCase().startsWith("+wwtbb")) {
    if (args.toString().startsWith("setquestion")) {
    if (message.author.id !== host) {
    message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
    return;
    }
    console.log(args);
    q = answer

    if (message.channel.type !== 'dm') {
    message.delete();
    }
    message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
    }

    //SETTING UP ANSWER 1
    if (args.toString().startsWith("seta1")) {
    if (message.author.id !== host) {
    message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
    return;
    }
    if (message.channel.type !== 'dm') {
    message.delete();
    }
    a1 = answer
    message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
    }

    //SETTING UP ANSWER 2
    if (args.toString().startsWith("seta2")) {
    if (message.author.id !== host) {
    message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
    return;
    }
    if (message.channel.type !== 'dm') {
    message.delete();
    }
    a2 = answer
    message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
    }

    //SETTING UP ANSWER 3
    if (args.toString().startsWith("seta3")) {
    if (message.author.id !== host) {
    message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
    return;
    }
    if (message.channel.type !== 'dm') {
    message.delete();
    }
    a3 = answer
    message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
    }

    //SETTING UP ANSWER 4
    if (args.toString().startsWith("seta4")) {
    if (message.author.id !== host) {
    message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
    return;
    }
    if (message.channel.type !== 'dm') {
    message.delete();
    }
    a4 = answer
    message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
    }

    //SETTING UP CORRECT ANSWER
    if (args.toString().startsWith("setca")) {
    if (message.author.id !== host) {
    message.channel.send(":no_entry_sign: **NOPE:** Only the host can perform this command.");
    return;
    }
    if (message.channel.type !== 'dm') {
    message.delete();
    }
    console.log(args);
    cA = answer
    if (cA == "A" || cA == "a" || cA == "1") {
    cA = a1;
  } else if (cA == "B" || cA == "B" || cA == "2") {
    cA = a2;
  } else if (cA == "C" || cA == "c" || cA == "3") {
    cA = a3;
  } else if (cA == "D" || cA == "d" || cA == "4") {
    cA = a4;
    }
    message.channel.send(":white_check_mark: **OK:** The operation completed successfully.");
    }
    console.log("qyestion" + q)
    console.log(a1)
    exports.answerOne = a1;
    exports.answerTwo = a2;
    exports.answerThree = a3;
    exports.answerFour = a4;
    exports.question = q;
    exports.correctAnswer = cA;
}
}


module.exports = {
    name: "Millionaire",
    constructor: function(discordClient, commandEmitter) {
        client = discordClient;
        commandEmitter.on('newMessage', newMessage);
    },
    destructor: function(commandEmitter) {
        commandEmitter.removeListener('newMessage', newMessage);
    }
}
