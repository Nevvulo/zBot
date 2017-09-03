const Discord = require('discord.js');
const Settings = require('./../structures/general/Settings.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
var colors = require('colors');

var kickReason = {};
var kickMember = null;
var kickConfirm = false;

exports.run = (client, message, args) => {
	message.delete();

	if (kickConfirm == true) {
		kickMember = kickMember.toString();
		kickMember = kickMember.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

		kickConfirm = false;
		message.guild.members.fetch(kickMember).then(function (member) {
			//Write kick information to .csv file
			var writer = csvWriter({
				headers: ["Guild", "Discord ID", "Date and Time", "Type of Punishment", "Punished by", "Reason"],
				sendHeaders: false
			})
			writer.pipe(fs.createWriteStream('./data/punishment/Punishment Tracker.csv', {
				flags: 'a'
			}))
			writer.write([message.guild.id, member.id, new Date(), "Kick", message.author.username, kickReason])
			writer.end()
			console.log(colors.green("* Successfully wrote kick for user '" + colors.underline(member.displayName) + "' to CSV file."));

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
						name: "ᴋɪᴄᴋ »  " + member.user.tag,
						icon_url: member.user.avatarURL({
							format: 'png'
						})
					},
					description: ":warning: <@" + member.id + "> has been kicked.\n",
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
							value: kickReason
						}
					],
					timestamp: new Date()
				}
			});

			member.send({
				embed: {
					color: 11475996,
					author: {
						name: "ᴋɪᴄᴋ »  " + member.user.tag,
						icon_url: member.user.avatarURL({
							format: 'png'
						})
					},
					description: ":warning: You have been kicked from " + message.guild.name + ".\n",
					fields: [{
							name: '**Reason**',
							value: kickReason
						}
					],
					timestamp: new Date()
				}
			});

			message.channel.send(":white_check_mark: **" + member + "** was successfully kicked.");
			message.channel.send("member.kick");
			kickMember = null;

		});
		return;
	}

	doNotDelete = true;
		doNotDelete = true;
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
			kickReason = kick;
		}

		message.guild.members.fetch(args.split(" ").toString()).then(function (member) {
			kickMember = member;
		if (kickMember.roles.has(Settings.getValue(message.guild, "moderatorRole"))) {
				message.channel.send(':no_entry_sign: **ERROR:** You can\'t kick other moderators.');
			} else {
				if (kick == ("")) {
					message.reply(':no_entry_sign: **NOPE:** You are kicking **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are kicking them.');
				} else {
					kickConfirm = true;
					exports.kickConfirm = kickConfirm
					exports.kickMember = kickMember
					message.reply(':oncoming_police_car: You are about to kick **' + member.displayName + '** for *' + kick + '*.\nTo confirm, type in `+kick`, or type in `+cancel` to cancel this operation.');
				}
			}
		}).catch(function (reason) {
			if (kickConfirm == false && kickMember == null || kickMember == ("") || kickMember == undefined) {
				message.reply(':no_entry_sign: **ERROR:** You need to enter a user to kick. See +help for more information.');
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

let command = 'kick'
, description = 'Kicks a specified user in this guild.'
, usage = 'kick **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
