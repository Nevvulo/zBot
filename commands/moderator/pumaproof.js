const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
message.delete();
if (debug == false) {
debug = true;
doNotDelete = true;
message.channel.send(":white_check_mark: **OK:** I've turned on **Puma proofing**. Prefixes 'bot:' and 'mod:' are now interchangable.");
exports.puma = true;
return;
} else {
debug = false;
doNotDelete = true;
message.channel.send(":white_check_mark: **OK:** I've turned off **Puma proofing**.");
exports.puma = false;	
return;
}
}