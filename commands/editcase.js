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
			message.reply(':no_entry_sign: **ERROR**: You need to enter a case to modify. See `' + await Settings.getValue(message.guild, "prefix") +'help editcase` for more information.');
			return;
		}

				if (value == "") {
					message.reply(':no_entry_sign: **NOPE:** You need to provide a value for **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are banning them.');
				} else {

			const filter = m => m.author == message.author;
			message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
			.then(collected => {
				console.log(collected.first().content)
				if (collected.first().content.startsWith('y')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: Case number **" + caseD + "** was successfully modified.")
				Punish.editPunish(caseD, message.guild, message.author, value)
				return;
			}
				if (collected.first().content.startsWith('n')) {
				answered = true;
				message.channel.send(":white_check_mark: **OK**: I won't modify case **" + caseD + "**.")
				return;
			}
			})
			.catch(collected => {
				if (answered === false) {
					message.channel.send(":large_orange_diamond: **OK**: The modification on case **" + caseD + "** won't be completed because you didn't reply with an answer in time.");
					return;
				} else {

				}
			});

			confirmPunish();
			async function confirmPunish() {
			message.channel.send(":gear: **MODIFY**: Are you sure you want to modify punishment case **" + caseD + "**? *(__y__es | __n__o)*")
			const embed = new Discord.MessageEmbed()
			embed.setAuthor('Modify » ', client.user.avatarURL( {format: 'png'} ))
			embed.addField("New Value for 'reason'", (value.length > 1024 ? value.substr(0, 1019) + "..." : value))
			embed.setColor("#e57373")
			embed.setFooter("zBot Punish - You are editing case " + caseD + " out of " + await Punish.grabCases(message.guild), client.user.avatarURL( {format: 'png'} ))
		message.channel.send({ embed })
	}

			}
}

let command = 'editcase'
, description = 'Edit a punishment case\'s reason.'
, usage = 'editcase **[case number]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod'
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
