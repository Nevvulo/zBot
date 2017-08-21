const Discord = require('discord.js');
const Help = require('./../structures/general/Help.js');
const Version = require('./../structures/general/Version.js');
var msg = "";

exports.run = (client, message, args) => {
if (args[0] !== undefined) {
  return message.channel.send(Help.getCommandHelp(args[0]));
} else {

doNotDelete = false;

const embed = new Discord.MessageEmbed();
var general = "copyright\nwarranty\ncredits\nafk\ninfo\nhelp\nhug\nping\nmusic"
var social = "profile\nstats\nequip\nleaderboard"
var misc = "git\nitems\npfp\nisay\ngraph\nmath\ndog\ncat"
var fun = "ship\nmerge\nchallenge\n8ball"
var mod = "mod\nrm\nuinfo\nwarn\nban\nsoftban\nmute\nsay\npermit\nsetgame\nfind\ncancel\nfilter"

embed.addField("General", general, true);
embed.addField("Social", social, true);
embed.addField("Moderator", mod, true);
embed.addField("Fun", fun, true);
embed.addField("Misc.", misc, true);

embed.setFooter("zBot • Help • version " + Version.getVersionNumber(), client.user.avatarURL( {format: 'png' }));
message.channel.send({ embed });

message.delete();
}
}

let command = 'help'
, description = 'Displays all available information about commands and help for zBot.'
, usage = '+help (command)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
