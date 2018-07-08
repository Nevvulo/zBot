const Discord = require('discord.js');
const fs = require('fs');
const moment = require('moment')
const Timer = require('./../../models/general/Timer.js')
const Moderation = require('./../../models/general/Moderation.js')
const Settings = require('./../general/Settings.js');
const Find = require('./../internal/Find.js');
const client = require('./../../bot.js').eval(0, "client");
const Duration = require("./../../util/Duration.js")
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class Timers {
	static timerExpired(timer) {
		client.users.fetch(timer.userID).then(function(timersender) {
			const embed = new Discord.MessageEmbed();
			const guild = Find.guild(timer.guildID)[0];
			embed.setColor("#1ebc8d");
			embed.setDescription(`${client.util.emoji("info", guild)} Your timer has finished!`)
			embed.addField("Reminder", timer.reason)
			embed.setFooter(`Timer created in ${guild.name}`)
			embed.setTimestamp(new Date(Number(timer.timerEnd)))
			timersender.send({ embed });
		});
	}

	static async resolveTime(arg) {
		const date = await Promise.all([
			Timers.datef(arg).catch(() => null),
			Timers.duration(arg).catch(() => null)
		]).then(ret => ret.find(Boolean));
		if (date && !isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		return null;
	}

	static async datef(arg) {
		const date = new Date(arg);
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		return null;
	}

	static async duration(arg) {
		const date = new Duration(arg).fromNow;
		if (!isNaN(date.getTime()) && date.getTime() > Date.now()) return date;
		return null;
	}

	static async getLastTimer(user, guild) {
		var timer = await Timer.findOne({ where: { userID: user.id, guildID: guild.id }, order: [['timerID', 'DESC']] });
		if (timer == null) return 0;
		return Number(timer.timerID);
	}

	static removeTimer(timerID, userID, guildID) {
		return Timer.destroy({ where: { "timerID": timerID, "userID": userID, "guildID": guildID } });
	}

	static async createTimer(user, guild, reason, timerEnd, timeSpecified) {
		let timerID = (isNaN(Number(await Timers.getLastTimer(user, guild) + 1)) ? 0 : Number(await Timers.getLastTimer(user, guild) + 1));
		Timer.create({
			timerID: timerID,
			userID: user.id,
			guildID: guild.id,
			reason: reason,
			timerEnd: timerEnd,
			timeSpecified: timeSpecified
		})
	}

	static async punishmentExpired(user, punishObject) {
		client.users.fetch(user).then(async function(sender) {
			const guild = Find.guild(punishObject.guildID)[0]
			if (punishObject.type == "ban") {
				await Punish.performPunish(guild, "unban", client.user, sender, `Punishment expired (#${punishObject.case})`, null)
			} else {
				await Punish.performPunish(guild, "unmute", client.user, sender, `Punishment expired (#${punishObject.case})`, null)
			}
		});
	}

	static async pollTimers() {
		let date = new Date().getTime();

		const timersGrabbed = await Timer.findAll({
			where: { timerEnd: { [Op.between]: [(date-4e6).toString(), (date+4e6).toString()] } },
			raw: true
	 	 });

		for (let i in timersGrabbed) {
			let timer = timersGrabbed[i]
			if (timer.timerEnd < date || !timer.timerEnd) {
				Timers.timerExpired(timer)
				Timers.removeTimer(timer.timerID, timer.userID, timer.guildID)
				continue;
			}
		}
	}

	static async pollPunishments() {
	var date = new Date().getTime();
	var punishCase = await Moderation.findAll({
		attributes: ['guildID', 'userID', 'case', 'type', 'duration', 'reason'],
		raw: true
	});

	if (punishCase != null) {
	for (var index in punishCase) {
		if (punishCase[index].duration !== null) {
			if (punishCase[index].duration < date) {
				Timers.punishmentExpired(punishCase[index].userID, punishCase[index])
				Moderation.destroy({ where: { guildID: punishCase[index].guildID, case: punishCase[index].case } });
			}	
		}
	}
	}
	}

}

module.exports = Timers;
