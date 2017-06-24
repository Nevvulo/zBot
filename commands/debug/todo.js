const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
message.delete();
message.channel.send(":white_check_mark: TODO:\n :no_entry_sign: **CRITICAL**\n*-Fix link filter if message contains more than two dots then no space it will get removed (ie. i like...hot dogs)\n-botDelMessage timing is not working correctly\n-bot:stats/profile aren't working\n-Profile picture won't display in embeds\n-Fix major issue with animated avatars and bots slowing promise await on profile to a halt*\n\n:warning: **IMPORTANT**\n*-Fix up badges and find more permanent solution to icons\n-Get leaderboard command working with ranking system\n-Fix spam filter to catch repetition more consistently\n-Fix up mod:rm auto delete message and add sub commands for deleting just bot messages*\n\n:large_blue_diamond: **NOT IMPORTANT/IDEAS**\n*-Add math command\n-Add more backgrounds to bot:profile and bot:stats*");
}