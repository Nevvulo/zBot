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
		var kick = "";
		var argsArray = message.content.split(" ").slice(1);
		var arrayLength = argsArray.length;

		if (arrayLength > 1) {
			for (let i = 0; i < arrayLength; i++) {
				kick = (kick + argsArray[i] + " ");
			}
			kick = kick.replace(argsArray[0], "");
			kick = kick.trim();
			reason = kick;
		}

		message.guild.members.fetch(args.split(" ").toString()).then(function (member) {
			if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS") || member.kickable == false) return message.channel.send(":no_entry_sign: **NOPE**: I don't have permission to kick this person. Make sure I have the `KICK_MEMBERS` permission.")

			if (member.roles.has(Settings.getValue(message.guild, "moderatorRole"))) {
				message.channel.send(':no_entry_sign: **ERROR:** You can\'t kick other moderators.');
			} else {
				if (kick == ("")) {
					message.reply(':no_entry_sign: **NOPE:** You are kicking **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are kicking them.');
				} else {

			const filter = m => m.author == message.author;
			message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
			.then(collected => {
				console.log(collected.first().content)
				if (collected.first().content.startsWith('y')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: **" + member.displayName + "** was successfully kicked.")
				Punish.performPunish(message.guild, "kick", message.author, member, reason)
				return;
			}
				if (collected.first().content.startsWith('n')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: I won't kick **" + member.displayName + "**.")
				return;
			}
			})
			.catch(collected => {
				if (answered === false) {
					message.channel.send(":large_orange_diamond: **OK**: The kick against **" + member.displayName + "** won't be completed because you didn't reply with an answer in time.");
					return;
				} else {

				}
			});

			confirmPunish();
			async function confirmPunish() {
			var amount = await Punish.getPunishments(message.guild, member, "kick");
			message.channel.send(":gear: **KICK**: Are you sure you want to issue this kick against **" + member.displayName + "**? *(__y__es | __n__o)*")
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
				message.reply(':no_entry_sign: **ERROR:** You need to enter a user to kick. See `' + Settings.getValue(message.guild, "prefix") +'help kick` for more information.');
				message.delete();
				return;
			} else {
				throw reason;
			}
		});
}

let command = 'kick'
, description = 'Kicks a specified user in this guild.'
, usage = 'kick **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
