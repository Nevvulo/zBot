const Discord = require('discord.js');
const fs = require('fs');
const main = require('./../../bot.js')
const moment = require('moment')

class Timers {

	static newTimer(timerObject, user) {
		if (!Timers.hasOwnProperty(user)) Timers[user] = {}, Timers[user].timers = [];
		Timers[user].timers.push(timerObject);
	}

	static saveTimers() {
		log("Saving timers...", logType.info);
		var contents = JSON.stringify(Timers, null, 4);
		//Write to secondary file first
		fs.writeFile("./data/user/Timers.prewrite.json", contents, "utf8", function(error) {
				if (error) {
						log("Timers couldn't be saved", logType.critical);
				} else {
						fs.writeFile("./data/user/Timers.json", contents, "utf8", function(error) {
								if (error) {
										log("Timers couldn't be saved, but the prewrite timers were saved successfully.", logType.critical);
								} else {
										fs.unlinkSync("./data/user/Timers.prewrite.json");
										log("Timers saved!", logType.good);
								}
						});
				}
		});
	}

	static timerExpired(user, timerObject) {
		client.users.fetch(user).then(function(timersender) {
		const embed = new Discord.MessageEmbed();
		embed.setAuthor("ᴛɪᴍᴇʀ » ", client.user.avatarURL( {format: 'png'} ));
		embed.setColor("#1ebc8d");
		embed.setDescription(":timer: **TIMES UP**: Your timer has finished!")

		var msg = timerObject.reason
		embed.addField("Reminder", msg)

		timersender.send({ embed });
	});
	}

	static pollTimers() {
	var date = new Date().getTime();
	for (var key in Timers) {
	var userSetting = Timers[key];
	if (userSetting != null) {
			if (userSetting.timers != null) {
					for (var index in userSetting.timers) {
							var timer = userSetting.timers[index];
							if (timer.timeout < date) {
				      	Timers.timerExpired(key, userSetting.timers[index])
				      	userSetting.timers.splice(index, 1);
				  }
			}
		}
	}
}
}
}

module.exports = Timers;
