const Discord = require('discord.js');

exports.run = (client, message, args) => {
message.delete();
const embed = new Discord.MessageEmbed();
embed.setAuthor("ᴄʀᴇᴅɪᴛs » zBot, created by zBlake#6715", client.user.avatarURL( {format: 'png'} ));
embed.setColor("#c64ed3");
var msg = "<:vicr123:351265732434329600> **vicr123** - for providing a codebase for zBot"
msg += "\n<:aren:351271085540507650> **Aren** - help with console code"
msg += "\n<:bdestin:351271085687177216> **bdestin** - providing code for music command"
embed.addField("Special Thanks", msg)

var msg = "Badge icons provided courtesy of https://www.flaticon.com/\nBackground images on profiles taken from Google Images"
embed.addField("Images", msg)

message.channel.send({ embed })
}

let command = 'credits'
, description = 'Shows credits and information relating to people who have contributed to zBot.'
, usage = '+credits'
, throttle = {usages: 1, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
