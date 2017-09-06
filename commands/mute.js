const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const Settings = require('./../structures/general/Settings.js');
const Punish = require('./../structures/moderation/HandlePunish.js');
var colors = require('colors');

let reason = {};
var answered = false;

exports.run = (client, message, args) => {
	message.delete();
		args = args.toString();
		args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

		//Grab command and remove user argument to get reason
		var mute = "";
		var argsArray = message.content.split(" ").slice(1);
		var arrayLength = argsArray.length;

		if (arrayLength > 1) {
			for (let i = 0; i < arrayLength; i++) {
				mute = (mute + argsArray[i] + " ");
			}
			mute = mute.replace(argsArray[0], "");
			mute = mute.trim();
			reason = mute;
		}

		message.guild.members.fetch(args.split(" ").toString()).then(function (member) {
			if (member.roles.has(Settings.getValue(message.guild, "moderatorRole"))) {
				message.channel.send(':no_entry_sign: **ERROR:** You can\'t mute other moderators.');
			} else {
				if (mute == ("")) {
					message.reply(':no_entry_sign: **NOPE:** You are muting **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are muting them.');
				} else {

			const filter = m => m.author == message.author;
			message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
			.then(collected => {
				console.log(collected.first().content)
				if (collected.first().content.startsWith('y')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: **" + member.displayName + "** was successfully muted.")
				Punish.performPunish(message.guild, "mute", message.author, member, reason)
				return;
			}
				if (collected.first().content.startsWith('n')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: I won't mute **" + member.displayName + "**.")
				return;
			}
			})
			.catch(collected => {
				if (answered === false) {
					message.channel.send(":large_orange_diamond: **OK**: The mute against **" + member.displayName + "** won't be completed because you didn't reply with an answer in time.");
					return;
				} else {

				}
			});

			confirmPunish();
			async function confirmPunish() {
			var amount = await Punish.getPunishments(message.guild, member, "mute");
			message.channel.send(":gear: **MUTE**: Are you sure you want to issue this mute against **" + member.displayName + "**? *(__y__es | __n__o)*")
			const embed = new Discord.MessageEmbed()
			embed.setAuthor('ᴘᴜɴɪꜱʜ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
			embed.addField("Reason", reason)
			embed.setColor("#b3cc39")
			embed.setFooter("This user has " + await Punish.getPunishments(message.guild, member, "warn") + " warnings, " + await Punish.getPunishments(message.guild, member, "mute") + " mutes, " +
			await Punish.getPunishments(message.guild, member, "kick") + " kicks and " + await Punish.getPunishments(message.guild, member, "ban") + " bans.", client.user.avatarURL( {format: 'png'} ))
		message.channel.send({ embed })
	}

			}
			}
		}).catch(function (reason) {
			if (args == "" || args == undefined) {
				message.reply(':no_entry_sign: **ERROR:** You need to enter a user to mute. See `' + Settings.getValue(message.guild, "prefix") +'help mute` for more information.');
				message.delete();
				return;
			} else {
				throw reason;
			}
		});
}

let command = 'mute'
, description = 'Mutes a specified user in this guild.'
, usage = 'mute **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
