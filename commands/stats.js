const Discord = require('discord.js');
const userStats = require('./../bot.js');
const fs = require('fs');
var colors = require('colors');
var expToNextLevel = null;

exports.run = (client, message, args) => {
var maxLevel = false;
let experience = JSON.parse(fs.readFileSync('./statistics.json', 'utf8'));
args = args.toString();
args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

if (args == null || args == "" || args == " ") {
args = userStats.commandIssuer;
}	

console.log(userStats.commandIssuer);
message.guild.fetchMember(args.split(" ").toString()).then(function(member) {

const filter = message => message.author.id === member.user.id && member.user.bot == false;
	message.channel.fetchMessages({ limit: 100 }).then(messages => {
		const filteredMessages = messages.filter(filter);
		const messageCount = filteredMessages.size;
console.log(messageCount);
embed = new Discord.RichEmbed("test");
embed.setAuthor("ꜱᴛᴀᴛɪꜱᴛɪᴄꜱ » " + member.user.tag);
embed.setColor("#f4bf42"); 
console.log(messageCount);
var msg = "From the *100* most recent messages, **" + messageCount + "** of them were created by *you*.";
embed.addField("**Message Count**", msg);

if (experience[message.author.id].level == 1) {
	expToNextLevel = "250";
	embed.setColor("#22447a"); 
} else if (experience[message.author.id].level == 2) {
	expToNextLevel = "500";
	embed.setColor("#275ca5"); 
} else if (experience[message.author.id].level == 3) {
	expToNextLevel = "750";
	embed.setColor("#2f6ac6"); 
} else if (experience[message.author.id].level == 4) {
	expToNextLevel = "1000";
	embed.setColor("#3475db"); 
} else if (experience[message.author.id].level == 5) {
	expToNextLevel = "1250";
	embed.setColor("#377be5"); 
} else if (experience[message.author.id].level == 6) {
	expToNextLevel = "1500";
	embed.setColor("#448eff"); 
} else if (experience[message.author.id].level == 7) {
	expToNextLevel = "1750";
	embed.setColor("#41a3ff"); 
} else if (experience[message.author.id].level == 8) {
	expToNextLevel = "2000";
	embed.setColor("#56bbff"); 
} else if (experience[message.author.id].level == 9) {
	expToNextLevel = "2500";
	embed.setColor("#41c6ff"); 
} else if (experience[message.author.id].level == 10) {
	expToNextLevel = "3000";
	embed.setColor("#41e5ff"); 
} else if (experience[message.author.id].level == 11) {
	expToNextLevel = "4000";
	embed.setColor("#41ffb3"); 
} else if (experience[message.author.id].level == 12) {
	expToNextLevel = "5000";
	embed.setColor("#41ff73"); 
} else if (experience[message.author.id].level == 13) {
	expToNextLevel = "6000";
	embed.setColor("#41ff47"); 
} else if (experience[message.author.id].level == 14) {
	expToNextLevel = "7000";
	embed.setColor("#79ff41"); 
} else if (experience[message.author.id].level == 15) {
	expToNextLevel = "8000";
	embed.setColor("#b6ff41"); 
} else if (experience[message.author.id].level == 16) {
	expToNextLevel = "9001";
	embed.setColor("#dcff41"); 
} else if (experience[message.author.id].level == 17) {
	expToNextLevel = "10000";
	embed.setColor("#f4d238"); 
} else if (experience[message.author.id].level == 18) {
	expToNextLevel = "11000";
	embed.setColor("#efaf2f"); 
} else if (experience[message.author.id].level == 19) {
	expToNextLevel = "12000";
	embed.setColor("#ef882f"); 
} else if (experience[message.author.id].level == 20) {
	expToNextLevel = "13000";
	embed.setColor("#ef4b2f"); 
} else if (experience[message.author.id].level == 0) {
	expToNextLevel = "100";
	embed.setColor("#53565b"); 
}

if (experience[message.author.id].level > 20) {
	embed.setColor("#e02000"); 
	maxLevel = true;
}

if (messageCount < 1) {
	message.channel.send(":no_entry_sign: **ERROR:** I couldn't retrieve your 'message count' from the most recent 100 messages. Sorry about that.");
}

var msg = "You are currently level **" + experience[message.author.id].level + "** on *Rainbow Gaming*.\n\nYou currently have **" + experience[message.author.id].experience + "** experience, and need **" + parseInt(expToNextLevel - experience[message.author.id].experience) + "** more until you level up to level **" + parseInt(experience[message.author.id].level + 1) + "**.";

if (maxLevel == true) {
var msg = "You are currently level **" + experience[message.author.id].level + "** on *Rainbow Gaming*.\nYou currently have **" + experience[message.author.id].experience + "** experience.\n:tada: **__You are at the maximum level! Congratulations!__**";
}

embed.addField("**Level**", msg);
message.channel.sendEmbed(embed);
})
})
message.delete();
}
