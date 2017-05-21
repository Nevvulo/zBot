const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
message.delete();
message.channel.send(":white_check_mark: TODO:\n :no_entry_sign: **CRITICAL**\n*-Change levelling system to be algorithm based instead of predetermined values\n-Find way to fix issue with JSON files being wiped after restart (known suspects are write whilst restart)\n-Rewrite music queue **and skip** command to work properly with integers\n-Fix major issue with animated avatars and bots slowing promise await on profile to a halt*\n\n:warning: **IMPORTANT**\n*-Fix up badges and find more permanent solution to icons\n-Get leaderboard command working with ranking system\n-Fix spam filter to catch repetition more consistently\n-Fix up mod:rm auto delete message and add sub commands for deleting just bot messages*\n\n:large_blue_diamond: **NOT IMPORTANT/IDEAS**\n*-Add more badges\n-Add botDelMessage more consistantly to modules\n-Automatic deletion of no_mic_text?*");
}