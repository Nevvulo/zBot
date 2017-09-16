const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const main = require('./../../bot.js')
const Settings = require('./../general/Settings.js');
var colors = require('colors');

class HandlePunish {
	static performPunish(guild, type, moderator, member, reason) {
		var channel = "";
		//Write punish information to .csv file
		var writer = csvWriter({
			headers: ["Guild", "Discord ID", "Date and Time", "Type of Punishment", "Punished by", "Reason"],
			sendHeaders: false
		})
		writer.pipe(fs.createWriteStream('./data/punishment/Punishment Tracker.csv', {
			flags: 'a'
		}))
		writer.write([guild.id, member.id, new Date(), type, moderator.id, reason])
		writer.end()
		log(colors.green("* Successfully wrote " + type + " for user '" + colors.underline(member.displayName) + "' to CSV file."), logType.success);

		if (client.channels.has(Settings.getValue(guild, "modLogsChannel"))) {
			channel = client.channels.get(Settings.getValue(guild, "modLogsChannel"));
		} else {
			log("Moderation logging channel " + Settings.getValue(guild, "modLogsChannel") + " not found", logType.critical);
			channel = 0;
		}

		const embed = new Discord.MessageEmbed()
		if (type == "ban") {
			if (member.bannable == false) throw "You don\'t have permission to ban that person.";
			if (!guild.member(client.user).hasPermission("BAN_MEMBERS")) throw "I don't have enough permissions to ban this person."

				embed.setAuthor('ʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription("You were banned from " + guild.name + " by " + moderator + ".")
				embed.setColor("#ce4937")
				embed.setTimestamp(new Date())
			member.send({ embed })

				embed.setAuthor('ʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was banned by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#ce4937")
				embed.setFooter('User ID: ' + member.id, client.user.avatarURL)
			channel.send({ embed })

			message.guild.ban(member, reason);
		} else if (type == "softban") {
			if (member.bannable == false) throw "You don\'t have permission to softban that person.";
			if (!guild.member(client.user).hasPermission("BAN_MEMBERS")) throw "I don't have enough permissions to softban this person."

				embed.setAuthor('sᴏғᴛʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription("You were softbanned from " + guild.name + " by " + moderator + ".")
				embed.setColor("#ce6e37")
				embed.setTimestamp(new Date())
			member.send({ embed })

				embed.setAuthor('sᴏғᴛʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was softbanned by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#ce6e37")
				embed.setFooter('User ID: ' + member.id, client.user.avatarURL)
			channel.send({ embed })

		} else if (type == "kick") {
			if (member.kickable == false) throw "You don't have permission to kick that person.";
			if (!guild.member(client.user).hasPermission("KICK_MEMBERS")) throw "I don't have enough permissions to kick this person.";

				embed.setAuthor('ᴋɪᴄᴋ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription("You were kicked from " + guild.name + " by " + moderator + ".")
				embed.setColor("#374bce")
				embed.setTimestamp(new Date())
			member.send({ embed })

				embed.setAuthor('ᴋɪᴄᴋ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was kicked by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#374bce")
				embed.setFooter('User ID: ' + member.id, client.user.avatarURL)
			channel.send({ embed })

		} else if (type == "warn") {
				embed.setAuthor('ᴡᴀʀɴɪɴɢ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription("You received a warning in " + guild.name + " from " + moderator + ".")
				embed.setColor("#ceb937")
				embed.setTimestamp(new Date())
			member.send({ embed })

				embed.setAuthor('ᴡᴀʀɴɪɴɢ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " received a warning from " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#ceb937")
				embed.setFooter('User ID: ' + member.id, client.user.avatarURL)
			channel.send({ embed })

		} else if (type == "mute") {
				embed.setAuthor('ᴍᴜᴛᴇ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription("You were muted in " + guild.name + " by " + moderator + ".")
				embed.setColor("#ad37ce")
				embed.setTimestamp(new Date())
			member.send({ embed })

				embed.setAuthor('ᴍᴜᴛᴇ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was muted by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#ad37ce")
				embed.setFooter('User ID: ' + member.id, client.user.avatarURL)
			channel.send({ embed })
		} else {
			throw "Invalid punishment type given."
		}
	}

	static getPunishments(guild, member, type) {
		let warnCount = 0;
		let muteCount = 0;
		let banCount = 0;
		let kickCount = 0;
		let softbanCount = 0;
		let overallCount = 0;

		const rl = readline.createInterface({
				input: fs.createReadStream('./data/punishment/Punishment Tracker.csv')
			});

		rl.on('line', function (line) {
			if (line.includes(member.id)) {
				overallCount = overallCount + 1
			}

			if (line.includes("warn") && line.includes(member.id) && line.includes(guild.id)) {
				warnCount += 1
			} else if (line.includes("mute") && line.includes(member.id) && line.includes(guild.id)) {
				muteCount += 1
			} else if (line.includes("ban") && line.includes(member.id) && line.includes(guild.id)) {
				banCount += 1
			} else if (line.includes("kick") && line.includes(member.id) && line.includes(guild.id)) {
				kickCount += 1
			} else if (line.includes("softban") && line.includes(member.id) && line.includes(guild.id)) {
				softbanCount += 1
			}
		});

		return new Promise((resolve) => {
		rl.on('close', function (close) {
			resolve(eval(`${type}Count`))
		});
	})
}
}

module.exports = HandlePunish;
