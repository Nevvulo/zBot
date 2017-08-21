const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
var colors = require('colors');

var banReason = {};
var banMember = null;
var banConfirm = false;

exports.run = (client, message, args) => {
	message.delete();

	if (banConfirm == true) {
		banMember = banMember.toString();
		banMember = banMember.replace("<", "").replace(">", "").replace("@", "").replace("!", "").toString();

		banConfirm = false;
		message.guild.fetchMember(banMember).then(function (member) {
			//Write ban information to .csv file
			var writer = csvWriter({
				headers: ["Discord ID", "Date and Time", "Type of Punishment", "Punished by", "Reason"],
				sendHeaders: false
			})
			writer.pipe(fs.createWriteStream('./data/punishment/Punishment Tracker.csv', {
				flags: 'a'
			}))
			writer.write([member.id, new Date(), "Softban", message.author.username, banReason])
			writer.end()
			console.log(colors.green("* Successfully wrote softban for user '" + colors.underline(member.displayName) + "' to CSV file."));


			channel = client.channels.get("345783379397967872");
			const embed = new Discord.MessageEmbed()
			channel.send({
				embed: {
					color: 11475996,
					author: {
						name: "sᴏғᴛʙᴀɴ »  " + member.user.tag,
						icon_url: member.user.avatarURL({
							format: 'png'
						})
					},
					description: ":warning: <@" + member.id + "> has been softbanned.\n",
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
							value: banReason
						}
					],
					timestamp: new Date()
				}
			});

			member.send({
				embed: {
					color: 11475996,
					author: {
						name: "sᴏғᴛʙᴀɴ »  " + member.user.tag,
						icon_url: member.user.avatarURL({
							format: 'png'
						})
					},
					description: ":warning: You have been softbanned on " + message.guild.name + ".\n",
					fields: [{
							name: '**Reason**',
							value: banReason
						}
					],
					timestamp: new Date()
				}
			});

			message.channel.send(":white_check_mark: " + member.displayName + " was successfully softbanned.");
			message.guild.ban(banMember, 7, banReason);
			message.guild.unban(banMember);
			banMember = null;

		});
		return;
	}

		doNotDelete = true;
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
			banReason = ban;
		}

		message.guild.fetchMember(args.split(" ").toString()).then(function (member) {
			banMember = member;
			if (member.roles.find("name", "Fleece Police")) {
				message.channel.send(':no_entry_sign: **ERROR:** You can\'t softban other moderators.');
			} else {
				if (ban == ("")) {
					message.reply(':no_entry_sign: **NOPE:** You are softbanning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are softbanning them.');
				} else {
					banConfirm = true;
					message.reply(':oncoming_police_car: You are about to softban **' + member.displayName + '** for *' + ban + '*. This will kick them from the server and remove any messages they have posted from the last two weeks.\nTo confirm, type in `+softban`, or type in `+cancel` to cancel this operation.');
				}
			}
		}).catch(function (reason) {
			if (banConfirm == false && banMember == null || ("") || undefined) {
				message.reply(':no_entry_sign: **ERROR:** You need to enter a user to softban. See mod:help for more information.');
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

let command = 'softban'
, description = 'Bans, and then un-bans a specified user from this guild, removing their messages in the process.'
, usage = '+softban **[mention]** **[reason]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
