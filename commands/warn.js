const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
var colors = require('colors');
var warnMember = "";

exports.run = (client, message, args) => {
		doNotDelete = true;
		args = args.toString();
		args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

		//Grab command and remove user argument to get reason
		var warning = "";
		var argsArray = message.content.split(" ").slice(1);
		var arrayLength = argsArray.length;

		if (arrayLength > 1) {
			for (let i = 0; i < arrayLength; i++) {
				warning = (warning + argsArray[i] + " ");
			}
			warning = warning.replace(argsArray[0], "");
			warning = warning.trim();
			warnReason = warning;
		}

		message.guild.fetchMember(args.split(" ").toString()).then(function(member) {
			// Init variables
			let warnReason = warning;
			warnMember = member;
			let warningCount = 0;

			warnMember = warnMember.toString();
			warnMember = warnMember.replace("<", "").replace(">", "").replace("@", "").replace("!", "").toString();

			if (member.roles.find("name", "Fleece Police")) {
				message.channel.send(':no_entry_sign: **ERROR:** You can\'t warn other moderators.');
			} else {
				if (warning == ("")) {
					message.reply(':no_entry_sign: **NOPE:** You are warning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are giving the warning.');
				} else {
					const rl = readline.createInterface({
						input: fs.createReadStream('./data/punishment/Punishment Tracker.csv')
						//Retrieve warning count info early so that it is ready to use when the user confirms the warn.
					});

					rl.on('line', function(line) {
						if (line.includes("Warning") && line.includes(member.id)) {
							warningCount = warningCount + 1
						}
					});
					console.log(warnMember)
					message.guild.fetchMember(warnMember).then(function(member) {

						//Write warning information to .csv file
						var writer = csvWriter({
							headers: ["Discord ID", "Date and Time", "Type of Punishment", "Punished by", "Reason"],
							sendHeaders: false
						})
						writer.pipe(fs.createWriteStream('./data/punishment/Punishment Tracker.csv', {
							flags: 'a'
						}))
						writer.write([member.id, new Date(), "Warning", message.author.username, warnReason])
						writer.end()
						console.log(colors.green("* Successfully wrote warning for user '" + colors.underline(member.displayName) + "' to CSV file."));

						channel = client.channels.get("345783379397967872");
						channel.send({
							embed: {
								color: 15056925,
								author: {
									name: "ᴡᴀʀɴɪɴɢ »  " + member.user.tag,
									icon_url: member.user.avatarURL({
										format: 'png'
									})
								},
								description: ":warning: <@" + member.id + "> has received a warning.\n",
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
										value: warnReason
									}
								],
								timestamp: new Date()
							}
						});

						member.send({
							embed: {
								color: 15056925,
								author: {
									name: "ᴡᴀʀɴɪɴɢ »  " + member.user.tag,
									icon_url: member.user.avatarURL({
										format: 'png'
									})
								},
								description: ":warning: You have received a warning on Rainbow Gaming.\n",
								fields: [{
									name: '**Reason**',
									value: warnReason
								}],
								timestamp: new Date()
							}
						});

						message.channel.send(":white_check_mark: **" + member + "** was successfully warned.");
					});
					return;
				}
			}
		}).catch(function(reason) {

			if (warnMember == null) {
				message.reply(':no_entry_sign: **ERROR:** You need to enter a user to warn. See +help for more information.');
				message.delete();
				return;
			}
			console.log(reason);
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

	message.delete();
}
