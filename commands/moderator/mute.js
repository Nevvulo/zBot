const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
var colors = require('colors');

var moderatorMute = {};
var muteReason = {};
var muteMember = null;
var muteConfirm = false;

exports.run = (client, message, args) => {
	
if (muteConfirm == true) {
muteConfirm = false;
doNotDelete = true;
			message.guild.fetchMember(muteMember).then(function(member) {
				embed = new Discord.RichEmbed("mute");
				embed.setAuthor("ᴍᴜᴛᴇ » " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
				embed.setColor("#983bef");

				var date = new Date();
				var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

				//Write mute information to .csv file
				var writer = csvWriter({
					headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"],
					sendHeaders: false
				})
				writer.pipe(fs.createWriteStream('punishment tracker.csv', {
					flags: 'a'
				}))
				writer.write([member.displayName + "#" + member.user.discriminator, dateString, "Mute", moderatorMute.username, muteReason])
				writer.end()
				console.log(colors.green("* Successfully wrote mute for user '" + colors.underline(member.displayName) + "' to CSV file."));

				var msg = muteMember + "\n";
				embed.addField("**User**", msg);

				var msg = moderatorMute + "\n";
				embed.addField("**Moderator**", msg);

				var msg = muteReason + "\n";
				embed.addField("**Reason**", msg);
				embed.setFooter(dateString);
				console.log("About to add muted role");
				member.addRole(client.guild.roles.get("229623781973426177"));
				console.log("About to set current voice channel to AFK");
				member.setVoiceChannel(muteMember.guild.channels.get(muteMember.guild.afkChannelID));


				muteMember.sendMessage(":warning: You have just been muted on Rainbow Gaming. Your ability to talk in voice/text channels has been revoked.");
				embeduser = new Discord.RichEmbed("mute-for-user");
				embeduser.setAuthor("ᴍᴜᴛᴇ » " + muteMember.displayName + "#" + muteMember.user.discriminator, muteMember.user.displayAvatarURL);
				embeduser.setColor("#983bef");
				var msg = muteReason + "\n";
				embeduser.addField("**Reason**", msg);

				var msg = dateString + "\n";
				embeduser.addField("**Timestamp**", msg);

				muteMember.sendEmbed(embeduser);


				message.channel.send(":white_check_mark: " + muteMember.displayName + " was succesfully muted.");
				client.channels.get("229575537444651009").sendEmbed(embed);
				muteMember = null;
				
			});
			return;
}	


if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
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

	message.guild.fetchMember(args.split(" ").toString()).then(function(member) {
		muteMember = member;
		if (member.roles.find("name", "Fleece Police")) {
			message.channel.send(':no_entry_sign: **ERROR:** You can\'t mute other moderators.');
			return;
		}
		if (member.roles.find("name", "Muted")) {
			message.reply(':no_entry_sign: **NOPE:** **' + member.displayName + '** is already muted.');
		} else {
			if (mute == ("")) {
				message.reply(':no_entry_sign: **NOPE:** You are muting **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are muting them.');
			} else {

				moderatorMute = message.author;
				muteConfirm = true;
				message.reply(':oncoming_police_car: You are about to mute **' + member.displayName + '** for *' + mute + '*.\n:no_entry: **This will prevent the user from talking in voice channels AND text channels.**\nTo confirm, type in `mod:mute`.');
			}
		}
	}).catch(function(reason) {
		
		if (muteConfirm == false && muteMember == null) {
			message.reply(':no_entry_sign: **ERROR:** You need to enter a user to mute. See mod:help for more information.');
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
} else {
	message.reply(":no_entry_sign: **NOPE:** You don't have access to this command.");
}
	
}