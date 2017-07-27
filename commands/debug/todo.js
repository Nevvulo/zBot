const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
message.delete();
message.channel.send(":white_check_mark: TODO:\n :no_entry_sign: **CRITICAL**\n*-Finish Version structure\n-get website going*\n\n:warning: **IMPORTANT**\n*-Fix spam filter to catch repetition more consistently\n-Improve command handler (ie. stop using substring, get ideas from other bots)\n-Clean up code\n-Clean up warn, ban, softban and mute and fix bug where reason can affect username parameter if certain characters are introduced in reason.*\n\n:large_blue_diamond: **NOT IMPORTANT/IDEAS**\n*-Fix Challenges: special ability and weapons, nerf heals and defend\n-Replace all embeds (that need profile picture) with .avatarURL( {format: 'png'} ) instead of .displayAvatarURL*");
}
