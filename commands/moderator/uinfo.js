const Discord = require('discord.js');

exports.run = (client, message, args) => {
	doNotDelete = true;
		args = args.toString();
		args = args.replace("<", "").replace(">", "").replace("@", "").replace("!", "").replace(/[^0-9.]/g, "");

	message.guild.fetchMember(args.split(" ").toString()).then(function(member) {

		embed = new Discord.RichEmbed("test");
		embed.setAuthor("???? ??????????? » " + member.user.username + "#" + member.user.discriminator, member.user.displayAvatarURL);
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
			var msg = "**Current Display Name** » " + member.displayName + "\n";
			msg += "**Username** » " + member.user.username + "\n";
			if (member.nickname != null) {
				msg += "**Nickname** » " + member.nickname;
			} else {
				msg += "**Nickname** » *This user has no nickname.*";
			}

			embed.addField("Names", msg);
		}

		embed.setFooter("User ID: " + member.user.id);
		message.channel.sendEmbed(embed);
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
message.delete();
}