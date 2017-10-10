const Discord = require('discord.js');
const moment = require('moment')
const fs = require('fs')
const Timers = require('./../structures/general/Timers.js');

exports.run = (client, message, args) => {
message.delete();
var time = args[0].toString();
const reason = args.slice(1).join(' ');

var now = moment()

var seconds;
if (time.endsWith("m")) {
    seconds = parseInt(time.substr(0, time.length - 1)) * 60;
} else if (time.endsWith("h")) {
    seconds = parseInt(time.substr(0, time.length - 1)) * 60 * 60;
} else if (time.endsWith("d")) {
    seconds = parseInt(time.substr(0, time.length - 1)) * 60 * 60 * 24;
} else if (time.endsWith("s")) {
    seconds = parseInt(time.substr(0, time.length - 1));
} else {
    seconds = parseInt(time) * 60;
}

var endDate = new Date().getTime() + seconds * 1000;
var startDate = new Date().getTime() + 0 * 1000;
console.log(startDate)
console.log(endDate)
var timer = {};
timer[message.author.id] = {
  "reason": reason,
  "timeout": endDate,
  "timespecified": time,
}

Timers.newTimer(timer[message.author.id], message.author.id)

const embed = new Discord.MessageEmbed();
embed.setAuthor("ᴛɪᴍᴇʀ » ", client.user.avatarURL( {format: 'png'} ));
embed.setColor("#26c6da");
embed.setDescription(":white_check_mark: **OK**: I'll remind you " + moment(endDate).fromNow() + " about '**" + reason + "**'.")

var msg = reason
embed.addField("Reason", msg)
var msg = moment(endDate).format('Do [of] MMMM, YYYY [at] h:mm:ss a');
embed.addField("Expiry Time", msg)

message.channel.send({ embed });
}

let command = 'timer'
, description = 'Allows you to create a timer with a reason. When the timer runs out, you\'ll be DM\'d by zBot.'
, usage = 'timer [time] [reason]'
, throttle = {usages: 1, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
