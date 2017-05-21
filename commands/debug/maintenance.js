const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
message.delete();
args = args.toString();
args = args.split(" ").toString();
console.log(args);
if (args == "delete") {
const filter = message => message.content.toLowerCase().includes("DEBUG") && message.user.bot == true;
	message.channel.fetchMessages({ limit: 97 }).then(messages => {
		const filteredMessages = messages.filter(filter);
		console.log(filteredMessages);
        message.channel.bulkDelete(filteredMessages);
		message.channel.send(":white_check_mark: **OK:** I've deleted all of the debug messages.");
	})
	return;
}

if (debug == false) {
debug = true;
doNotDelete = true;
message.channel.send(":white_check_mark: **Maintenance mode** is now *enabled*. All commands will now output all available information to chat.");
exports.maintenanceEnabled = true;
return;
} else {
debug = false;
doNotDelete = true;
message.channel.send(":white_check_mark: **Maintenance mode** is now *disabled*.");
exports.maintenanceEnabled = false;	
return;
}

}