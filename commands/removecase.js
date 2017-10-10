const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const Settings = require('./../structures/general/Settings.js');
const Punish = require('./../structures/moderation/HandlePunish.js');
var colors = require('colors');

let reason = {};
var answered = false;

exports.run = async (client, message, args) => {
	message.delete();
		var caseD = args[0].toString();

		//Grab command and remove user argument to get reason
		var value = "";
		var argsArray = message.content.split(" ").slice(1);
		var arrayLength = argsArray.length;

		if (arrayLength > 1) {
			for (let i = 0; i < arrayLength; i++) {
				value = (value + argsArray[i] + " ");
			}
			value = value.replace(argsArray[0], "");
			value = value.trim();
			reason = value;
		}

		if (args == "" || args == undefined) {
			message.reply(':no_entry_sign: **ERROR**: You need to enter a case to remove. See `' + await Settings.getValue(message.guild, "prefix") +'help removecase` for more information.');
			return;
		}

			const filter = m => m.author == message.author;
			message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
			.then(collected => {
				if (collected.first().content.startsWith('y')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: Case number **" + caseD + "** was successfully removed.")
				Punish.removePunish(caseD, message.guild, message.author)
				return;
			}
				if (collected.first().content.startsWith('n')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: I won't remove case **" + caseD + "**.")
				return;
			}
			})
			.catch(collected => {
				if (answered === false) {
					message.channel.send(":large_orange_diamond: **OK**: The deletion of case **" + caseD + "** won't be completed because you didn't reply with an answer in time.");
					return;
				} else {

				}
			});

			confirmPunish();
			async function confirmPunish() {
			var reasonFinal = await Punish.getReason(caseD, message.guild)
			message.channel.send(":gear: **REMOVE**: Are you sure you want to remove punishment case **" + caseD + "**? *(__y__es | __n__o)*")
			const embed = new Discord.MessageEmbed()
			embed.setAuthor('Remove » ', client.user.avatarURL( {format: 'png'} ))
			embed.addField("Punishment Reason", reasonFinal.substr(0, 1019) + "...")
			embed.setColor("#e57373")
			embed.setFooter("zBot Punish - You are removing case " + caseD + " out of " + await Punish.grabCases(message.guild), client.user.avatarURL( {format: 'png'} ))
		message.channel.send({ embed })
	}
}

let command = 'editcase'
, description = 'Edit a punishment case\'s reason.'
, usage = 'ban **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod'
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
