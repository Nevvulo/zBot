const Discord = require('discord.js');
const client = new Discord.Client();
var debug = false;

exports.run = (client, message, args) => {
	message.channel.send(":alarm_clock: **HANG ON:** Give me a minute...").then(function (newMessage, messageArray) {
		message.guild.fetchMembers().then(function () {
			message.reply(":white_check_mark: **OK:** All members for this guild fetched.").then(message => {
        message.delete({ timeout: 8000 });
      });
			newMessage.delete ();
		}).catch (function () {
			message.reply(":no_entry_sign: **ERROR:** Something didn't work.");
			newMessage.delete ();
		});
	});
	message.delete ();
}
