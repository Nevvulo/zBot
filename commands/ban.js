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
		var ban = "";
		var argsArray = message.content.split(" ").slice(1);
		var arrayLength = argsArray.length;

		if (arrayLength > 1) {
			for (let i = 0; i < arrayLength; i++) {
				ban = (ban + argsArray[i] + " ");
			}
			ban = ban.replace(argsArray[0], "");
			ban = ban.trim();
			reason = ban;
		}

		if (args == "" || args == undefined) {
			message.reply(':no_entry_sign: **ERROR**: You need to enter a user to ban. See `' + Settings.getValue(message.guild, "prefix") +'help ban` for more information.');
			return;
		}

		message.guild.members.fetch(args.split(" ").toString()).then(function (member) {
			if (!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply(":no_entry_sign: **NOPE**: I don't have permission to ban this person. Make sure I have the `BAN_MEMBERS` permission and try again.")
			if (member.bannable == false) return message.reply(":no_entry_sign: **NOPE**: You can't ban this person.")
			if (member.roles.has(Settings.getValue(message.guild, "moderatorRole"))) {
				message.channel.send(':no_entry_sign: **ERROR:** You can\'t ban other moderators.');
		 } else {
				if (ban == ("")) {
					message.reply(':no_entry_sign: **NOPE:** You are banning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are banning them.');
				} else {

			const filter = m => m.author == message.author;
			message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
			.then(collected => {
				console.log(collected.first().content)
				if (collected.first().content.startsWith('y')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: **" + member.displayName + "** was successfully banned.")
				Punish.performPunish(message.guild, "ban", message.author, member, reason)
				return;
			}
				if (collected.first().content.startsWith('n')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: I won't ban **" + member.displayName + "**.")
				return;
			}
			})
			.catch(collected => {
				if (answered === false) {
					message.channel.send(":large_orange_diamond: **OK**: The ban against **" + member.displayName + "** won't be completed because you didn't reply with an answer in time.");
					return;
				} else {

				}
			});

			confirmPunish();
			async function confirmPunish() {
			var amount = await Punish.getPunishments(message.guild, member, "ban");
			message.channel.send(":gear: **BAN**: Are you sure you want to issue this ban against **" + member.displayName + "**? *(__y__es | __n__o)*")
			const embed = new Discord.MessageEmbed()
			embed.setAuthor('ᴘᴜɴɪꜱʜ » ' + member.user.tag, member.user.avatarURL( {format: 'png'} ))
			embed.addField("Reason", reason)
			embed.setColor("#f4b942")
			embed.setFooter("This user has " + await Punish.getPunishments(message.guild, member, "warn") + " warnings, " + await Punish.getPunishments(message.guild, member, "mute") + " mutes, " +
			await Punish.getPunishments(message.guild, member, "kick") + " kicks and " + await Punish.getPunishments(message.guild, member, "ban") + " bans.", client.user.avatarURL( {format: 'png'} ))
		message.channel.send({ embed })
	}

			}
			}
		}).catch(function (reason) {
				throw reason;
		});
}

let command = 'ban'
, description = 'Ban a specified user from this server.'
, usage = 'ban **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod'
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
