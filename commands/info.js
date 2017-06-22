const Discord = require('discord.js');
const fs = require('fs');
var colors = require('colors');
var footer = ""

exports.run = (client, message, args) => {
	embed = new Discord.RichEmbed("test");
	embed.setAuthor("ʙᴏᴛ ꜱᴛᴀᴛɪꜱᴛɪᴄꜱ");
	embed.setColor("#f4bf42"); {

		var uptime = Math.round(client.uptime / 60000);
		var minOrHour = "minute(s)";

		if (client.uptime > 3600000) {
			uptime = Math.round(client.uptime / 3600000);
			minOrHour = "hour(s)";
		}

		switch (Math.floor(Math.random() * 1000) % 4) {
		case 0:
			footer = "The picture used in 'bot:profile' is the same picture used in my profile picture!";
			break;
		case 1:
			footer = "Xail Bot is developed in JavaScript using the Discord.js library.";
			break;
		case 2:
			footer = "Suggest new ideas for Xail Bot on GitHub, or DM @zBlake#6715!";
			break;
		case 3:
			footer = "Xail Bot has 'Who wants to be a millionaire' built in to it!";
			break;
		}


		let data = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`;
		var emsg = "**Uptime**: " + uptime + " " + minOrHour + "\n**Logged in as user:** " + client.user.username + "\n**Memory Usage:** " + data;
		embed.addField("Bot Debug Information", emsg);
		embed.setFooter(footer);
	}

	message.channel.sendEmbed(embed);
}