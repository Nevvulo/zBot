const Discord = require("discord.js");
const events = require('events');
const commandEmitter = new events.EventEmitter();
const Settings = require('./../general/Settings.js');
const Guild = require("./../../models/guild/Guild.js")

let lastMessages = {};
let sameMessageCount = {};

/*

When asking the question "what is the most efficient way to detect spammers without disrupting normal users",
we need to think about what the best formula is for checking if someone is spamming. To do that, we need to ask
what "spam" really is

In zBot, "spamming" is defined as;
* repeating a certain word, line or phrase (similar or exactly the same) multiple times over a short period of time

Here are the rules for a spammer to be caught by zBot;
[SPAM TYPE 1: Message Spam (for spamming the same or very similar messages)]
[CHECK 1] User needs to have sent the same or similar message more than once
[CHECK 2] Check 1 needs to have happened at least 3 times and within a time interval of 5 seconds

[SPAM TYPE 2: Fast Spam (specifically designed for detecting users that are posting messages at an alarmingly quick rate, regardless of message content)]
[CHECK 1] User needs to have sent at least 4 messages within the past 3.5 seconds

[SPAM TYPE 3: Flood Spam (designed to catch spam that is intentionally trying to flood/cover a large amount of the chat)]
[CHECK 1] If more than 80% of the message content 
*/

module.exports = {};
