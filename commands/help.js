const Discord = require('discord.js');
const Help = require('./../structures/general/Help.js');
const Version = require('./../structures/general/Version.js');
const Settings = require('./../structures/general/Settings.js');
var msg = "";

exports.run = async (client, message, args) => {
if (args[0] !== undefined) {
  return message.channel.send(await Help.getCommandHelp(args[0], message.guild));
} else {

doNotDelete = false;

const embed = new Discord.MessageEmbed();

var general = "config\ncopyright\nwarranty\ncredits\nafk\ninfo\nhelp\nhug\ntag\nping\nmusic\ntimer"
var social = "profile\nstats\nequip\nleaderboard"
var misc = "git\npfp\nisay\nmath\ndog\ncat\nsearch\nflip\nface\nmods\ntranslate"
var fun = "ship\nmerge\nchallenge\n8ball\ndadjoke\nlol"
var mod = "mod\nrm\nuinfo\nwarn\nban\nsoftban\nmute\nkick\nunban\nsay\nfind\nfilter"

embed.setAuthor("zBot • Help • version " + Version.getVersionNumber() + " »  ", client.user.avatarURL( {format: 'png' }));
embed.setColor("#26c6da");
embed.setDescription(":information_source: These are all of the commands available in zBot. To view more information about a specific command, type `" + await Settings.getValue(message.guild, "prefix") + "help [command]`.")
embed.addField("General", general, true);
embed.addField("Moderator", mod, true);
embed.addField("Misc.", misc, true);
embed.addField("Social", social, true);
embed.addField("Fun", fun, true);

message.channel.send({ embed });

message.delete();
}
}

let command = 'help'
, description = 'Displays all available information about commands and help for zBot.'
, usage = 'help (command)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
