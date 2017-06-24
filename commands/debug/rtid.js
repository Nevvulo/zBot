const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
function getUserString(user) {
    var u = user;
    if (user.user != null) {
        u = user.user;
    }
    return u.tag;
}

console.log(args.toString());
args = message.content.substr(11);
console.log(args);

var foundUsers = client.users.findAll("username", args);
	if (foundUsers.length == 0) {
		message.channel.send(':no_entry_sign: **ERROR:** Couldn\'t find anyone with that username. You might want to try again.');
	} else {
		var reply = ":white_check_mark: **OK:** We found " + parseInt(foundUsers.length) + " users with that username.\n```\n";
		for (let user of foundUsers) {
			reply += getUserString(user) + ": " + user.id + "\n";

			message.guild.fetchMember(user).then(function (member) {
				message.channel.send(":white_check_mark: **OK:** *" + getUserString(user) + "* exists on this server.");
			}).catch(function () {
				message.channel.send(":no_entry_sign: **ERROR:** *" + getUserString(user) + "* does not exist on this server.");
			});
		}
		reply += "```";
		message.channel.send(reply);
	}
	message.delete();
}