const Discord = require('discord.js');
const Settings = require('./../general/Settings.js');
var colors = require('colors');
const Moderation = require('./../../models/general/Moderation.js')
const Sequelize = require('sequelize')
const client = require('./../../bot.js').eval(0, "client");
const Op = Sequelize.Op

const options = {
	muteOptions: {
		title: "Mute",
		type: "mute",
		names: { singular: "mute", plural: "mutes", tense: "muted", from: false },
		color: "#673ab7"
	},
	unmuteOptions: {
		title: "Unmute",
		type: "unmute",
		names: { singular: "unmute", plural: "unmutes", tense: "unmuted", from: false },
		color: "#66bb6a"
	},
	warnOptions: {
		title: "Warning",
		type: "warn",
		names: { singular: "warning", plural: "warnings", tense: "warned", from: false },
		color: "#ffc107"
	},
	banOptions: {
		title: "Ban",
		type: "ban",
		names: { singular: "ban", plural: "bans", tense: "banned", from: true },
		color: "#f44336"
	},
	unbanOptions: {
		title: "Unban",
		type: "unban",
		names: { singular: "unban", plural: "unbans", tense: "unbanned", from: false },
		color: "#66bb6a"
	},
	softbanOptions: {
		title: "Softban",
		type: "softban",
		names: { singular: "softban", plural: "softbans", tense: "softbanned", from: true },
		color: "#ff5722"
	},
	kickOptions: {
		title: "Kick",
		type: "kick",
		names: { singular: "kick", plural: "kicks", tense: "kicked", from: true },
		color: "#ff9800"
	}
}

function IdentifierError(value, guild) {
	this.value = value;
	this.message = "Punishment ID #" + this.value + " doesn't exist in guild ID " + guild.id
	this.toString = function() {
		return this.message;
	};
}

function MissingCasesError(value, guild) {
	this.value = value;
	this.message = "Aborting operation at bulk" + value + ", not all cases provided exist in database in guild " + guild.id
	this.toString = function() {
		return this.message;
	};
}

function Invalid(message) {
	this.message = message
	this.toString = function() {
		return this.message;
	};
}

class Punish {
	static async returnEmbedOptions(type, value) {
		const data = value
		function getTintedColor(color, v) {
	    if (color.length >6) { color= color.substring(1,color.length)}
	    var rgb = parseInt(color, 16);
	    var r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
	    var g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
	    var b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
	    r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16);
	    if (r.length == 1) r = '0' + r;
	    g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16);
	    if (g.length == 1) g = '0' + g;
	    b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16);
	    if (b.length == 1) b = '0' + b;
	    return "#" + r + g + b;
		}

		const main = {
			created: created()
		}

		function created() {
			if (!data.punishment) return;
			const username = data.member.user ? data.member.user.username : data.member.username;
			const moderator = data.moderator.user ? data.moderator.user.username : data.moderator.username;
			return {
			footer: 'User ID ─ ' + data.member.id + ' | Case ' + data.caseNo,
			avatar: data.moderator.user ? data.moderator.user.displayAvatarURL() : data.moderator.displayAvatarURL(),
			description: client.util.emoji("info", data.guild) + " `" + moderator + "` (" + data.moderator.toString() + ") **" + options[data.punishment + "Options"].names.tense + "** `" + username + "` (" + data.member.toString() + ").",
			userdescription: client.util.emoji("info", data.guild) + " You were **" + options[data.punishment + "Options"].names.tense + "** " + (options[data.punishment + "Options"].names.from ? "from" : "in") + " " + data.guild.name + " by `" + moderator + "` (" + data.moderator.toString() + ").",
			color: options[data.punishment + "Options"].color
		}
		}

		return main[type];
	}

	static get options() {
		return options;
	}

	static async grabCases(guild) {
	const count = await Moderation.count({ where: { guildID: guild.id }} )
	return count;
	}

	static async doesCaseExistInGuild(id, guild) {
	const count = await Moderation.count({ where: { guildID: guild.id, case: id }} )
	return count;
	}

	static async bulkDoesCaseExistInGuild(fromid, toid, guild) {
	const count = await Moderation.count({ where: { guildID: guild.id, case: { [Op.between]: [fromid, toid] } }} )
	return count;
	}

	static async getCase(id, guild) {
		var exists = await Punish.doesCaseExistInGuild(id, guild);
		if (exists < 1) return false;
		var punishCase = await Moderation.findOne({ where: { guildID: guild.id, case: id } });
		return punishCase;
	}

	static async getLastCase(guild) {
		var punishCase = await Moderation.findOne({ where: { guildID: guild.id }, order: [['case', 'DESC']] });
		if (!punishCase) return 0;
		return punishCase.case;
	}

	static async getReason(id, guild) {
		var exists = await Punish.doesCaseExistInGuild(id, guild);
		if (exists < 1) return client.util.log("Invalid case ID " + id + " at getReason", "critical")
		var punishCase = await Moderation.findOne({ where: { guildID: guild.id, case: id } });
		return punishCase.reason;
	}

	static async getModerator(id, guild) {
		if (typeof(id) == "object") {
			var punishCase = await Moderation.findAll({
		    attributes: ['guildID', 'case', 'punishedBy'],
		    where: { guildID: guild.id, case: { [Op.between]: [id[0], id[id.length-1]] } },
		    raw: true
		});
		return punishCase;
		}
		var exists = await Punish.doesCaseExistInGuild(id, guild);
		if (exists < 1) return client.util.log("Invalid case ID " + id + " at doesCaseExistInGuild", "critical")
		var punishCase = await Moderation.findOne({ where: { guildID: guild.id, case: id } });
		return punishCase.punishedBy;
	}

	static async editPunish(id, guild, moderator, value) {
		const punishCase = await Moderation.findOne({ where: { guildID: guild.id, case: id } });
		const caseNo = id;
		const exists = await Punish.doesCaseExistInGuild(id, guild);
		const embed = new Discord.MessageEmbed()
		if (!exists) throw new MissingCasesError(caseNo, guild)
		if (!value) value = "*No reason provided.*";
		const user = client.users.get(punishCase.userID) || client.users.fetch(punishCase.userID);
		const tag = user.tag;
		const avatar = user.displayAvatarURL();

		Moderation.update({ reason: value }, { where: { guildID: guild.id, case: id } });

		const embedOptions = await await Punish.returnEmbedOptions("created", {caseNo: id, guild: guild, punishment: punishCase.type, 
			member: user, moderator: moderator, reason: value})
		embed.setAuthor(options[punishCase.type + "Options"].title + ' » ' + tag, avatar)
		embed.setDescription(embedOptions.description)
		embed.addField("Reason", value)
		embed.setColor(embedOptions.color)
		embed.setFooter(embedOptions.footer, embedOptions.avatar)

		for (let i in punishCase.message.instances) {
			const channel = guild.channels.get(punishCase.message.instances[i].channel)
			const final = await channel.messages.fetch(punishCase.message.instances[i].message)
			final.edit("", {embed: embed})
		}
	}

	static async performPunish(guild, type, moderator, member, reason, duration) {
		if (!type || !options[type + "Options"]) throw new TypeError("Invalid punishment type provided, expected `MUTE` `WARN` `BAN` `KICK` `SOFTBAN`, got " + type);
		const tag = member.user ? member.user.tag : member.tag;
		const avatar = member.user ? member.user.displayAvatarURL() : member.displayAvatarURL();
		const caseNo = (isNaN(Number(await Punish.getLastCase(guild) + 1)) ? 0 : Number(await Punish.getLastCase(guild) + 1));

		const embed = new Discord.MessageEmbed()
		const memberembed = new Discord.MessageEmbed()
		if (!reason) reason = `*No reason supplied. ${moderator} can use \`${await guild.prefix}reason ${caseNo} [new reason]\` to add a reason.*`

		const channels = await Settings.grabLoggingChannels(guild, "moderation", "punishments");
		if (!channels) return;
		if (!duration) duration = null

		if (await Settings.getValue(guild, "dmPunishments")) {
			const embedOptions = await Punish.returnEmbedOptions("created", {caseNo: caseNo, guild: guild, punishment: type, member: member, moderator: moderator, reason: reason})
			memberembed.setAuthor(options[type + "Options"].title + ' » ' + tag, avatar)
			memberembed.setDescription(embedOptions.userdescription)
			memberembed.addField("Reason", reason)
			memberembed.setColor(embedOptions.color)
			memberembed.setFooter(embedOptions.footer, embedOptions.avatar)
			member.send({ embed: memberembed })
		}

		execute: try {
			if (type === "ban") {
				if (!member.user) break execute;
				member.ban({reason: "[ " + moderator.tag + " ] Banned for " + reason })
			} else if (type === "softban") {
				let id = member.id
				if (!member.user) break execute;
				member.ban({days: 14, reason: "[ " + moderator.tag + " ] Softbanned for " + reason })
				guild.members.unban(id, {reason: "[ " + moderator.tag + " ] " + "Unbanned from softban"});
			} else if (type === "kick") {
				member.kick("[ " + moderator.tag + " ] Kicked for " + reason)
			} else if (type === "mute") {
				const role = guild.roles.get(await Settings.getValue(guild, "muteRole"));
				if (!role) throw new Invalid("Case #" + caseNo + " | " + tag + " couldn't be muted because muteRole doesn't exist on this server")
				member.roles.add(role, {reason: "[ " + moderator.tag + " ] Muted for " + reason })
			} else if (type === "unmute") {
				const role = guild.roles.get(await Settings.getValue(guild, "muteRole"));
				if (!role) throw new Invalid("Case #" + caseNo + " | " + tag + " couldn't be muted because muteRole doesn't exist on this server")
				member.roles.remove(role, {reason: "[ " + moderator.tag + " ] Unmuted for " + reason })
			} else if (type === "unban") {
				let id = member.id
				guild.members.unban(id, {reason: "[ " + moderator.tag + " ] " + "Unbanned" });
			}
		} catch (err) {
			throw new Invalid("Case #" + caseNo + " | " + tag + " couldn't be punished\n" + err);
		}

		Moderation.create({
		"case": caseNo,
		"guildID": guild.id,
		"userID": member.id,
		"time": new Date().toString(),
		"type": type,
		"punishedBy": moderator.id,
		"reason": reason,
		"punishedByName": tag,
		"duration": duration,
		"message": { cases: [] } 
		});

		client.util.log(colors.green("Successfully wrote " + type + " for user '" + colors.underline(tag) + "' to database."), "success");

		if (channels) {
			const embedOptions = await await Punish.returnEmbedOptions("created", {caseNo: caseNo, guild: guild, punishment: type, member: member, moderator: moderator, reason: reason})
			embed.setAuthor(options[type + "Options"].title + ' » ' + tag, avatar)
			embed.setDescription(embedOptions.description)
			embed.addField("Reason", reason)
			embed.setColor(embedOptions.color)
			embed.setFooter(embedOptions.footer, embedOptions.avatar)

		//Send the log to all the channel(s)
			let obj = { instances: [] };
			for (let i in channels) {
				if (await Settings.checkIgnore(guild, channels[i], "logs")) continue;
				if (!guild.channels.has(channels[i])) continue;
				const m = await guild.channels.get(channels[i]).send({ embed })
				obj.instances.push({ message: m.id, channel: m.channel.id});			
			}
			await Moderation.update({ message: obj }, { where: { guildID: guild.id, case: caseNo } });
		}
	}

	static async displayPunishmentsText(user, guild) {
		const punishObj = options
		let punishArr = [];
		for (const [key, value] of Object.entries(punishObj)) {
			let punishCount = await Punish.getPunishments(guild, user, value.type)
			if (punishCount > 0 && (key !== "unban" || key !== "unmute")) {
				punishArr.push({"type": key, "value": punishCount, "object": value})
			}
		};

		let msg = "";
		if (punishArr.length < 1) {
			return "This user has no punishments"
		}

		msg = "This user has " + punishArr[0].value + " " + (punishArr[0].value > 1 ? punishArr[0].object.names.plural : punishArr[0].object.names.singular)
		punishArr.shift();

		for (let i in punishArr) {
			const currentCase = punishArr[i];
			if (punishArr.length > 1) {
				msg += ", " + currentCase.value + " " + (currentCase.value > 1 ? currentCase.object.names.plural : currentCase.object.names.singular)
			} else if (punishArr.length == 1 && msg.indexOf(currentCase.type) < 0) {
				if (!currentCase.object) {
					return "An error occured whilst retrieving punishment information for this user.";
				}
				msg += " and " + currentCase.value + " " + (currentCase.value > 1 ? currentCase.object.names.plural : currentCase.object.names.singular)
			}
			punishArr.shift();
		}
		return msg;
	}

	static async getPunishments(guild, member, type) {
		if (type == "overall") type = "";
		const count = await Moderation.count({ where: (type == "" ? { guildID: guild.id, userID: member.id } : { type: type, guildID: guild.id, userID: member.id }) } )
		return count;
	}
}

module.exports = Punish;
