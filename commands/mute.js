const Discord = require('discord.js');
const Settings = require('./../structures/general/Settings.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
var colors = require('colors');

var muteReason = {};
var muteMember = null;
var muteConfirm = false;

exports.run = (client, message, args) => {
	message.delete();

	if (muteConfirm == true) {
		muteMember = muteMember.toString();
		muteMember = muteMember.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

		muteConfirm = false;
		message.guild.members.fetch(muteMember).then(function (member) {
			//Write mute information to .csv file
			var writer = csvWriter({
				headers: ["Guild", "Discord ID", "Date and Time", "Type of Punishment", "Punished by", "Reason"],
				sendHeaders: false
			})
			writer.pipe(fs.createWriteStream('./data/punishment/Punishment Tracker.csv', {
				flags: 'a'
			}))
			writer.write([message.guild.id, member.id, new Date(), "Mute", message.author.username, muteReason])
			writer.end()
			console.log(colors.green("* Successfully wrote mute for user '" + colors.underline(member.displayName) + "' to CSV file."));

			if (client.channels.has(Settings.getValue(message.guild, "modLogsChannel"))) {
								channel = client.channels.get(Settings.getValue(message.guild, "modLogsChannel"));
						} else {
								log("Moderation logging channel " + Settings.getValue(message.guild, "modLogsChannel") + " not found", logType.critical);
						}
			const embed = new Discord.MessageEmbed()
			channel.send({
				embed: {
					color: 11475996,
					author: {
						name: "ᴍᴜᴛᴇ »  " + member.user.tag,
						icon_url: member.user.avatarURL({
							format: 'png'
						})
					},
					description: ":warning: <@" + member.id + "> has been muted.\n",
					fields: [{
							name: '**User**',
							value: "<@" + member.id + ">"
						},
						{
							name: '**Moderator**',
							value: "<@" + message.author.id + ">"
						},
						{
							name: '**Reason**',
							value: muteReason
						}
					],
					timestamp: new Date()
				}
			});

			member.send({
				embed: {
					color: 11475996,
					author: {
						name: "ᴍᴜᴛᴇ »  " + member.user.tag,
						icon_url: member.user.avatarURL({
							format: 'png'
						})
					},
					description: ":warning: You have been muted on " + message.guild.name + ".\n",
					fields: [{
							name: '**Reason**',
							value: muteReason
						}
					],
					timestamp: new Date()
				}
			});

			message.channel.send(":white_check_mark: **" + member + "** was successfully muted.");
			member.addRole(muteMember.guild.roles.get(Settings.getValue(message.guild, "muteRole")));
			muteMember = null;

		});
		return;
	}

	doNotDelete = true;
		doNotDelete = true;
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
			muteReason = mute;
		}

		message.guild.members.fetch(args.split(" ").toString()).then(function (member) {
			muteMember = member;
		if (muteMember.roles.has(Settings.getValue(message.guild, "moderatorRole"))) {
				message.channel.send(':no_entry_sign: **ERROR:** You can\'t mute other moderators.');
			} else {
				if (mute == ("")) {
					message.reply(':no_entry_sign: **NOPE:** You are muting **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are muting them.');
				} else {
					muteConfirm = true;
					message.reply(':oncoming_police_car: You are about to mute **' + member.displayName + '** for *' + mute + '*.\nTo confirm, type in `+mute`, or type in `+cancel` to cancel this operation.');
				}
			}
		}).catch(function (reason) {
			if (muteConfirm == false && muteMember == null || ("") || undefined) {
				message.reply(':no_entry_sign: **ERROR:** You need to enter a user to mute. See +help for more information.');
				message.delete();
				return;
			}
			switch (Math.floor(Math.random() * 1000) % 4) {
			case 0:
				message.channel.send(':no_entry_sign: **ERROR:** That didn\'t work. You might want to try again.');
				break;
			case 1:
				message.channel.send(':no_entry_sign: **ERROR:** Something\'s blocking us! You might want to try again.');
				break;
			case 2:
				message.channel.send(':no_entry_sign: **ERROR:** Too much cosmic interference! You might want to try again.');
				break;
			case 3:
				message.channel.send(':no_entry_sign: **ERROR:** We are experiencing technical difficulties. You might want to try again.');
				break;
			}
		});
}

let command = 'mute'
, description = 'Mutes a specified user in this guild.'
, usage = 'mute **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
