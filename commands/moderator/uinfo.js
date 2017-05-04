exports.run = (client, message, args) => {
const Discord = require('discord.js');
var warnCount = 0;
var muteCount = 0;
var overallCount = 0;
const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
input: fs.createReadStream('./punishment tracker.csv')
});


	doNotDelete = true;
		args = args.toString();
		args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

	message.guild.fetchMember(args.split(" ").toString()).then(function(member) {


		embed = new Discord.RichEmbed("test");
		embed.setAuthor("ᴜꜱᴇʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ » " + member.user.username + "#" + member.user.discriminator, member.user.displayAvatarURL);
		embed.setColor("#c64ed3");

		{
			var msg = "**Created** » " + member.user.createdAt.toDateString() + " at " + member.user.createdAt.toLocaleTimeString() + "\n";
			if (member.joinedAt.getTime() == 0) {
				msg += "**Joined** » -8... and beyond! Discord seems to be giving incorrect info... :(";
			} else {
				msg += "**Joined** » " + member.joinedAt.toDateString() + " at " + member.joinedAt.toLocaleTimeString();
			}

			embed.addField("Timestamps", msg);
		}

		{
			var msg = "**Username** » " + member.user.username + "\n";
			if (member.nickname != null) {
				msg += "**Nickname** » " + member.nickname;
			} else {
				msg += "**Nickname** » *This user has no nickname.*";
			}

			embed.addField("Names", msg);
		}
		
		{
			
					
		
		rl.on('line', function(line) {
					
			if (line.includes(member.displayName + "#" + member.user.discriminator)) {
				overallCount = overallCount + 1
			}
			
			if (line.includes("Warning") && line.includes(member.displayName + "#" + member.user.discriminator)) {
				warnCount = warnCount + 1	
			} else if (line.includes("Mute") && line.includes(member.displayName + "#" + member.user.discriminator)) {
				muteCount = muteCount + 1
			} 

		console.log(overallCount);
		});
		
		rl.on('close', function(close) {
			console.log(warnCount);
			
						
			var msg = "**Total Number of Warnings** » " + warnCount + "\n";
			msg += "**Total Number of Mutes** » " + muteCount + "\n";
			msg += "**Total Cases** » " + overallCount;
			

			
			embed.addField("Punishment History", msg);
			
			
			{
			if (member.highestRole.toString().replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "") == "224372132019306496") {
			var msg = "**Role** » *Member* \n";
			} else if (member.highestRole.toString().replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "") == "268886481479794690") {
			var msg = "**Role** » *Subscriber* \n";
			} else if (member.highestRole.toString().replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "") == "269802212367138817") {
			var msg = "**Role** » *VIP* \n";
			} else if (member.highestRole.toString().replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "") == "301298292308967426") {	
			var msg = "**Role** » *Administrator* \n";
			} else if (member.highestRole.toString().replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "") == "268886465927315457") {
			var msg = "**Role** » *Moderator* Level **1** (Fleece Police)\n";	
			} else if (member.highestRole.toString().replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "") == "223989611397906443") {
			var msg = "**Role** » *Moderator* Level **2** (Adept Fleece Police)\n";	
			} else if (member.highestRole.toString().replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "") == "224371729466654721") {
			var msg = "**Role** » *Owner / Streamer*\n";	
			} else {
			var msg = "**Role** » *Bot*\n";	
			}
			
			if (member.presence.status == "online") {
				msg += "**Presence** » *Online*";
			} else if (member.presence.status == "offline") {
				msg += "**Presence** » *Invisible / Offline*";
			} else if (member.presence.status == "idle") {
				msg += "**Presence** » *Idle*";
			} else if (member.presence.status == "dnd") {
				msg += "**Presence** » *Do Not Disturb*";	
			}

			embed.addField("Identification", msg);
			}
			
			{
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
			
			embed.addField("More Information", msg);
			}
		
			embed.setFooter("User ID: " + member.user.id);
			message.channel.sendEmbed(embed);

			message.delete();
		});
		}
		}).catch(function(reason) {
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
			

			

