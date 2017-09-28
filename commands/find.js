const Find = require('./../structures/general/UserFinder.js');
const Discord = require('discord.js');
var rancheck = false;

exports.run = (client, message, args) => {
	args = args.toString()
	message.delete();
	var users = Find.getUserUsernames(args, message.guild)

	const embed = new Discord.MessageEmbed();
	embed.setAuthor("ᖴɪɴᴅ » ", client.user.avatarURL( {format: "png"} ));
	embed.setColor("#8babdd");
	if (users.length == 1) {
	var msg = users
	embed.addField(users.length + " user found containing '" + args + "'", msg)
} else if (users.length > 1 && users.length < 6) {
	var msg = users.join('\n')
	embed.addField(users.length + " users found containing '" + args + "'", msg)
} else if (users.length > 1 && users.length > 6) {
	var msg = users.slice(0,5).join('\n')
	embed.addField(users.length + " users found containing '" + args + "'", msg)
} else if (users.length < 1) {
	embed.addField(users.length + " users found containing '" + args + "'", "\u200B")
	embed.setFooter("Check for spelling, and try to generalize keywords to get more results.")
} else if (users.length > 10) {
		embed.setFooter("Please narrow your query.")
	}

	message.channel.send({ embed })
}

let command = 'find'
, description = 'Find a user.'
, usage = 'find **(user)**'
, permission = 'mod'
exports.settings = {command: command, description: description, usage: usage, permission: permission}
