const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
	message.delete ();
	args = args.toString();
	args = args.split(" ").toString();
	console.log(args);
	if (args == "delete") {
		const filter = msg => msg.author.bot == true && msg.content.includes("📄" || ":page_facing_up:");
		message.channel.fetchMessages({
			limit: 99
		}).then(messages => {
			const filteredMessages = messages.filter(filter);
			message.channel.bulkDelete(filteredMessages);
			message.channel.send(":white_check_mark: **OK:** I've deleted all of the debug messages.");
		})
		return;
	}

	if (debug == false) {
		debug = true;
		doNotDelete = true;
		message.channel.send(":white_check_mark: **Developer mode** is now *enabled*. All commands will now output all available information to chat.");
		exports.developerMode = true;

		var presence = {};
		presence.game = {};
		presence.status = "dnd";
		presence.afk = false;
		presence.game.name = null;
		client.user.setPresence(presence);
		message.guild.member(client.user).setNickname("zBot - ᴅᴇᴠᴇʟᴏᴘᴇʀ ᴍᴏᴅᴇ");

		return;

	} else {
		debug = false;
		doNotDelete = true;
		message.channel.send(":white_check_mark: **Developer mode** is now *disabled*.");
		exports.developerMode = false;

		var presence = {};
		presence.game = {};
		presence.status = "online";
		presence.afk = false;
		presence.game.name = null;
		client.user.setPresence(presence);
		message.guild.member(client.user).setNickname("zBot");

		return;
	}

}
