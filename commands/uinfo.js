exports.run = (client, message, args) => {
	const Discord = require('discord.js');
	var warnCount = 0;
	var muteCount = 0;
	var overallCount = 0;
	const readline = require('readline');
	const fs = require('fs');
	const rl = readline.createInterface({
			input: fs.createReadStream('./data/punishment/Punishment Tracker.csv')
		});

	function getUserID(user) {
		var u = user;
		if (user.user != null) {
			u = user.user;
		}
		return u.id;
	}
	args = args.toString();
	args = args.replace(",", " ").replace(",", " ").replace(",", " ").toString();

	console.log(args);
	if (!args.includes("<")) {
		var foundUsers = client.users.findAll("username", args);
		if (foundUsers.length == 0) {
			message.channel.send(':no_entry_sign: **ERROR:** Couldn\'t find anyone with that username. You might want to try again.');
			return;
		} else {
			for (let user of foundUsers) {
				args = getUserID(user);
			}
		}
	} else {
		args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");
		console.log("Username not provided for arguments.");
	}

	message.guild.fetchMember(args).then(function (member) {

		const embed = new Discord.RichEmbed();
		embed.setAuthor("ᴜꜱᴇʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ » " + member.user.username + "#" + member.user.discriminator, member.user.avatarURL( {format: 'png'} ));
		embed.setColor("#c64ed3");{
			var msg = "**Created** » " + member.user.createdAt.toDateString() + " at " + member.user.createdAt.toLocaleTimeString() + "\n";
			if (member.joinedAt.getTime() == 0) {
				msg += "**Joined** » -8... and beyond! Discord seems to be giving incorrect info... :(";
			} else {
				msg += "**Joined** » " + member.joinedAt.toDateString() + " at " + member.joinedAt.toLocaleTimeString();
			}

			embed.addField("Timestamps", msg, true);
		}{
			var msg = "**Username** » " + member.user.username + "\n";
			if (member.nickname != null) {
				msg += "**Nickname** » " + member.nickname;
			} else {
				msg += "**Nickname** » *This user has no nickname.*";
			}

			embed.addField("Names", msg, true);
		}{

			rl.on('line', function (line) {

				if (line.includes(member.id)) {
					overallCount = overallCount + 1
				}

				if (line.includes("Warning") && line.includes(member.id)) {
					warnCount = warnCount + 1
				} else if (line.includes("Mute") && line.includes(member.id)) {
					muteCount = muteCount + 1
				}
			});

			rl.on('close', function (close) {
				var msg = "**Total Number of Warnings** » " + warnCount + "\n";
				msg += "**Total Number of Mutes** » " + muteCount + "\n";
				msg += "**Total Cases** » " + overallCount;

				embed.addField("Punishment History", msg, true);{
					var msg = "**Role** » " + member.highestRole.name.toString() + "\n";

					if (member.presence.status == "online") {
						msg += "**Presence** » *Online*";
					} else if (member.presence.status == "offline") {
						msg += "**Presence** » *Invisible / Offline*";
					} else if (member.presence.status == "idle") {
						msg += "**Presence** » *Idle*";
					} else if (member.presence.status == "dnd") {
						msg += "**Presence** » *Do Not Disturb*";
					}

					embed.addField("Identification", msg, true);
				}{
					msg = null;

					if (member.selfMute == true) {
						var msg = "This user is **self-muted**.\n";
					}

					if (member.selfDeaf == true) {
						msg += "This user is **self-deafened**.\n";
					}

					if (member.serverMute == true) {
						msg += "This user is **server-muted**.\n";
					}

					if (member.serverDeaf == true) {
						msg += "This user is **server-deafened**.\n";
					}

					if (msg == null || undefined) {
						var msg = "No extra information.\n";
					}

					embed.addField("More Information", msg, true);
				}

				embed.setFooter("User ID: " + member.user.id);
				message.channel.send({ embed });

				message.delete ();
			});
		}
	}).catch (function (reason) {
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
}
