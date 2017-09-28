const Settings = require('./../structures/general/Settings.js');
const Discord = require("discord.js");
var tosend = [];

exports.run = (client, message, args) => {
tosend = [];
message.delete();
var moderatorAmount = message.guild.roles.get(Settings.getValue(message.guild, "moderatorRole")).members.array().length
let count = 0;
var amountLeft = 0;
let exit = false;
if (message.guild.roles.get(Settings.getValue(message.guild, "moderatorRole")).members.size < 1) {
return message.reply(":no_entry_sign: **ERROR**: The owner of this guild hasn't set up a moderator role in the config.")
}
message.guild.roles.get(Settings.getValue(message.guild, "moderatorRole")).members.forEach(member => {
count += 1
amountLeft = moderatorAmount - count;

if (tosend.toString().length > 372 && exit == false) {
	exit = true;
	tosend.pop();
	return message.reply(":white_check_mark: **OK:** Here is a list of all of the available moderators.\n" + tosend.join('\n').substr(0, 372) + "\n... and " + eval(amountLeft + 1) + " more.")
}

if (args.toString() == "online") {
	if (member.presence.status == "online") {
		tosend.push("<:online:358966444995641346> " + member.displayName)
	}
	return;
}

if (args.toString() == "offline") {
	if (member.presence.status == "offline") {
		tosend.push("<:offline:358966445096435714> " + member.displayName)
	}
	return;
}

	if (member.presence.status == "online") {
		tosend.push("<:online:358966444995641346> " + member.displayName)
	} else if (member.presence.status == "dnd") {
		tosend.push("<:dnd:358989738805297163> " + member.displayName)
	} else if (member.presence.status == "idle") {
		tosend.push("<:idle:358989738843176961> " + member.displayName)
	} else {
		tosend.push("<:offline:358966445096435714> " + member.displayName)
	}

})
	if (exit) return;
	if (tosend.length < 1) return message.reply(":no_entry_sign: **ERROR:** I couldn't find any moderators under that search.")
	return message.reply(":white_check_mark: **OK:** Here is a list of all of the moderators" + (args.toString() == "" ? ".\n" : (args.toString() == "online" ? " that are online.\n" : " that are offline.\n")) + tosend.join('\n'))

}

let command = 'mods'
, description = 'Shows all of the available moderators.'
, usage = 'mods (online | offline)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
