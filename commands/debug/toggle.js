const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
message.delete();
if (debug == false) {
debug = true;
doNotDelete = true;
message.channel.send(":white_check_mark: **Administrative tools** are now *enabled*.");
exports.debugEnabled = true;
return;
} else {
debug = false;
doNotDelete = true;
message.channel.send(":white_check_mark: **Administrative tools** are now *disabled*.");
exports.debugEnabled = false;	
return;
}
}