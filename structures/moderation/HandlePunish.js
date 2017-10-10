const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const main = require('./../../bot.js')
const Settings = require('./../general/Settings.js');
var colors = require('colors');

const Moderation = require('./../../models/Moderation.js')

class HandlePunish {

	static async grabCases(guild) {
	const count = await Moderation.count({ where: { guildID: guild.id }} )
	return count;
	}

	static async getReason(id, guild) {
		var punishCase = await Moderation.findOne({ where: { guildID: guild.id, case: id } });
		return punishCase.reason;
	}

	static async removePunish(id, guild, moderator) {
		var punishCase = await Moderation.findOne({ where: { guildID: guild.id, case: id } });
		Moderation.destroy({ where: { guildID: guild.id, case: id } });
		var channel = "";
		var caseNo = id;
		if (client.channels.has(await Settings.getValue(guild, "modLogsChannel"))) {
			channel = client.channels.get(await Settings.getValue(guild, "modLogsChannel"));
		} else {
			channel = 0;
		}

		const embed = new Discord.MessageEmbed()
	guild.members.fetch(punishCase.userID).then(function (member) {
		if (punishCase.type == "ban") {
				embed.setAuthor('ʙᴀɴ ʀᴇᴍᴏᴠᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":red_circle: " + moderator + " removed a ban under " + member + ".")
				embed.addField("Punishment Reason", punishCase.reason)
				embed.setColor("#d50000")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "softban") {
				embed.setAuthor('sᴏғᴛʙᴀɴ ʀᴇᴍᴏᴠᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":red_circle: " + moderator + " removed a softban under " + member + ".")
				embed.addField("Punishment Reason", punishCase.reason)
				embed.setColor("#FF6D00")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "kick") {
				embed.setAuthor('ᴋɪᴄᴋ ʀᴇᴍᴏᴠᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":red_circle: " + moderator + " removed a kick under " + member + ".")
				embed.addField("Punishment Reason", punishCase.reason)
				embed.setColor("#FFAB00")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "warn") {
				embed.setAuthor('ᴡᴀʀɴɪɴɢ ʀᴇᴍᴏᴠᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":red_circle: " + moderator + " removed a warning under " + member + ".")
				embed.addField("Punishment Reason", punishCase.reason)
				embed.setColor("#FFD600")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "mute") {
				embed.setAuthor('ᴍᴜᴛᴇ ʀᴇᴍᴏᴠᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":red_circle: " + moderator + " removed a mute under " + member + ".")
				embed.addField("Punishment Reason", punishCase.reason)
				embed.setColor("#6200EA")
				embed.setFooter('User ID: ' + member.id + " | Case " + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		}
	});
	}

	static async editPunish(id, guild, moderator, value) {
		var punishCase = await Moderation.findOne({ where: { guildID: guild.id, case: id } });
		Moderation.update({ reason: value }, { where: { guildID: guild.id, case: id } });
		var channel = "";
		var caseNo = id;
		if (client.channels.has(await Settings.getValue(guild, "modLogsChannel"))) {
			channel = client.channels.get(await Settings.getValue(guild, "modLogsChannel"));
		} else {
			channel = 0;
		}

		const embed = new Discord.MessageEmbed()
	guild.members.fetch(punishCase.userID).then(function (member) {
		if (punishCase.type == "ban") {
				embed.setAuthor('ʙᴀɴ ᴇᴅɪᴛᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":information_source: " + moderator + " edited a ban under " + member + ".")
				embed.addField("Old Reason", punishCase.reason)
				embed.addField("New Reason", value)
				embed.setColor("#e57373")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "softban") {
				embed.setAuthor('sᴏғᴛʙᴀɴ ᴇᴅɪᴛᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":information_source: " + moderator + " edited a softban under " + member + ".")
				embed.addField("Old Reason", punishCase.reason)
				embed.addField("New Reason", value)
				embed.setColor("#ff8a65")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "kick") {
				embed.setAuthor('ᴋɪᴄᴋ ᴇᴅɪᴛᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":information_source: " + moderator + " edited a kick under " + member + ".")
				embed.addField("Old Reason", punishCase.reason)
				embed.addField("New Reason", value)
				embed.setColor("#ffb74d")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "warn") {
				embed.setAuthor('ᴡᴀʀɴɪɴɢ ᴇᴅɪᴛᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":information_source: " + moderator + " edited a warning under " + member + ".")
				embed.addField("Old Reason", punishCase.reason)
				embed.addField("New Reason", value)
				embed.setColor("#ffd54f")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		} else if (punishCase.type == "mute") {
				embed.setAuthor('ᴍᴜᴛᴇ ᴇᴅɪᴛᴇᴅ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":information_source: " + moderator + " edited a mute under " + member + ".")
				embed.addField("Old Reason", punishCase.reason)
				embed.addField("New Reason", value)
				embed.setColor("#9575cd")
				embed.setFooter('User ID: ' + member.id + " | Case " + caseNo, client.user.avatarURL)
			channel.send({embed: embed})
		}
	});
	}

	static async performPunish(guild, type, moderator, member, reason) {
		var channel = "";
		//Write punish information to .csv file
		var caseNo = (isNaN(eval(await HandlePunish.grabCases(guild) + 1)) ? 0 : eval(await HandlePunish.grabCases(guild) + 1));
		Moderation.create({
											case: caseNo,
											guildID: guild.id,
											userID: member.id,
											time: new Date().toString(),
											type: type,
											punishedBy: moderator.id,
											reason: reason });

		log(colors.green("* Successfully wrote " + type + " for user '" + colors.underline(member.displayName) + "' to CSV file."), logType.success);

		if (client.channels.has(await Settings.getValue(guild, "modLogsChannel"))) {
			channel = client.channels.get(await Settings.getValue(guild, "modLogsChannel"));
		} else {
			channel = 0;
		}

		const membed = new Discord.MessageEmbed()
		const embed = new Discord.MessageEmbed()

		if (type == "ban") {
				membed.setAuthor('ʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				membed.setDescription("You were banned from " + guild.name + " by " + moderator + ".")
				membed.addField("Reason", reason)
				membed.setColor("#f44336")
				membed.setTimestamp(new Date())
			member.send({embed: membed})

				embed.setAuthor('ʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was banned by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#f44336")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})

			guild.ban(member, reason);
		} else if (type == "softban") {
				membed.setAuthor('sᴏғᴛʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				membed.setDescription("You were softbanned from " + guild.name + " by " + moderator + ".")
				membed.addField("Reason", reason)
				membed.setColor("#ff5722")
				membed.setTimestamp(new Date())
			member.send({embed: membed})

				embed.setAuthor('sᴏғᴛʙᴀɴ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was softbanned by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#ff5722")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})

			let id = member.id
			guild.ban(member, reason);
			guild.unban(id, "Unbanned from softban");
		} else if (type == "kick") {
				membed.setAuthor('ᴋɪᴄᴋ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				membed.setDescription("You were kicked from " + guild.name + " by " + moderator + ".")
				membed.addField("Reason", reason)
				membed.setColor("#ff9800")
				membed.setTimestamp(new Date())
			member.send({embed: membed})

				embed.setAuthor('ᴋɪᴄᴋ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was kicked by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#ff9800")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})

		} else if (type == "warn") {
				membed.setAuthor('ᴡᴀʀɴɪɴɢ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				membed.setDescription("You received a warning in " + guild.name + " from " + moderator + ".")
				membed.addField("Reason", reason)
				membed.setColor("#ffc107")
				membed.setTimestamp(new Date())
			member.send({embed: membed})

				embed.setAuthor('ᴡᴀʀɴɪɴɢ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " received a warning from " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#ffc107")
				embed.setFooter('User ID: ' + member.id + ' | Case ' + caseNo, client.user.avatarURL)
			channel.send({embed: embed})

		} else if (type == "mute") {
				membed.setAuthor('ᴍᴜᴛᴇ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				membed.setDescription("You were muted in " + guild.name + " by " + moderator + ".")
				membed.addField("Reason", reason)
				membed.setColor("#673ab7")
				membed.setTimestamp(new Date())
			member.send({embed: membed})

				embed.setAuthor('ᴍᴜᴛᴇ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
				embed.setDescription(":warning: " + member + " was muted by " + moderator + ".")
				embed.addField("Reason", reason)
				embed.setColor("#673ab7")
				embed.setFooter('User ID: ' + member.id + " | Case " + caseNo, client.user.avatarURL)
			channel.send({embed: embed})

			var role = guild.roles.get("id", Settings.getValue(guild, "muteRole"));
			member.addRole(role);
		} else {
			throw "Invalid punishment type given."
		}
	}

	static async getPunishments(guild, member, type) {
		if (type == "overall") type = "";
		let warnCount = 0;
		let muteCount = 0;
		let banCount = 0;
		let kickCount = 0;
		let softbanCount = 0;
		let overallCount = 0;

		const count = await Moderation.count({ where: { type: type, guildID: guild.id, userID: member.id }} )
		return count;
}
}

module.exports = HandlePunish;
