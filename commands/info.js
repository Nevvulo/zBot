const Discord = require('discord.js');
const fs = require('fs');
var colors = require('colors');

exports.run = (client, message, args) => {
embed = new Discord.RichEmbed("test");
embed.setAuthor("ʙᴏᴛ ꜱᴛᴀᴛɪꜱᴛɪᴄꜱ");
embed.setColor("#f4bf42"); {

var uptime = Math.round(client.uptime / 60000);
var minOrHour = "minutes";

if (client.uptime > 3600000) {
uptime = Math.round(client.uptime / 600000);
minOrHour = "hours";
}

let data = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} / ${Math.round(process.memoryUsage().heapTotal / 1024)}MB`;
var emsg = "**Uptime**: " + uptime + " " + minOrHour + "\n**Logged in as user:** " + client.user.username + "\n**Memory Usage:** " + data;
	embed.addField("Bot Debug Information", emsg);
}

message.channel.sendEmbed(embed);
}