const Discord = require('discord.js');
var msg = "";

exports.run = (client, message, args) => {
doNotDelete = false;

const embed = new Discord.MessageEmbed();
var general = "copyright\nwarranty\ncredits\nafk\ninfo\ndog\ncat\nhelp\nhug\nping\nmusic"
var social = "profile\nstats\nequip\nleaderboard"
var misc = "git\nitems\npfp\nisay"
var fun = "ship\nmerge\nchallenge\n8ball"
var mod = "mod\nrm\nuinfo\nwarn\nban\nsoftban\nmute\nsay\npermit\nsetgame\nreboot\ncancel"

embed.addField("General", general, true);
embed.addField("Social", social, true);
embed.addField("Moderator", mod, true);
embed.addField("Fun", fun, true);
embed.addField("Misc.", misc, true);

embed.setFooter("this is in progress");
message.channel.send({ embed });


if (args == "mod" && message.member.roles.find("name", "Bot Owners")) {
    var helpMessage = "**Moderator commands only:**```\n" +
        "* mod		    		Toggles moderation status.\n";

    helpMessage = helpMessage +
        "rm [number]       		Deletes a number of messages.\n" +
        "uinfo [user]      		Gets information about a user.\n" +
        "warn [user] [reason]      Give a warning to a user.\n" +
        "ban [user] [reason]       Ban someone from the server.\n" +
		"mute [user] [reason]       Mute somebody on the server.\n" +
		"softban [user] [reason]       Softban someone on the server.\n" +
        "say [message]	   	  Say something under the bot's name.\n" +
		"permit [user]	   	  Permit a user to post any links for 3 minutes.\n" +
        "setgame [game]			Set what the bot is playing to whatever you want.\n" +
        "* panic     		      Toggles panic mode.\n" +
        "deletemessages    		Automatically removes bot messages after 10 seconds.\n" +
        "cancel            		Cancels a pending operation.\n" +
        "help              		Prints this help message.\n" +
        "reboot            		Asks zBot to reconnect.\n" +
        "\n" +
        "* = denotes an admin only command\n" +
		"The user argument currently only works when said user is mentioned.\n" +
        "These commands need to be prefixed with +\n" +
        "```";
    message.delete();
    message.channel.send(helpMessage);
	return;
}
message.delete();
}
