const Discord = require('discord.js');
const readline = require('readline');
const fs = require('fs');
const UserFinder = require('./../structures/general/UserFinder.js')
const rl = readline.createInterface({
    input: fs.createReadStream('./data/punishment/Punishment Tracker.csv')
});
const Punish = require('./../structures/moderation/HandlePunish.js');

exports.run = (client, message, args) => {
    args = args.slice(0).join(' ');
    args = UserFinder.getUser(args).shift().id
    if (message.guild.members.exists("id", args)) {
        message.guild.members.fetch(args).then(function(member) {
            const embed = new Discord.MessageEmbed();
            embed.setAuthor("ᴜꜱᴇʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ » " + member.user.username + "#" + member.user.discriminator, member.user.avatarURL({
                format: 'png'
            }));
            embed.setColor("#c64ed3");
                var msg = "**Created** » " + member.user.createdAt.toDateString() + " at " + member.user.createdAt.toLocaleTimeString() + "\n";
                if (member.joinedAt.getTime() == 0) {
                    msg += "**Joined** » Discord seems to be giving incorrect info... :(";
                } else {
                    msg += "**Joined** » " + member.joinedAt.toDateString() + " at " + member.joinedAt.toLocaleTimeString();
                }

                embed.addField("Timestamps", msg, true);
                var msg = "**Username** » " + member.user.username + "\n";
                if (member.nickname != null) {
                    msg += "**Nickname** » " + member.nickname;
                } else {
                    msg += "**Nickname** » *This user has no nickname.*";
                }

                embed.addField("Names", msg, true);

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

                    embed.addField("Identification", msg);


										uinfo();
										async function uinfo() {
										let warnCount = await Punish.getPunishments(message.guild, member, "warn");
										let banCount = await Punish.getPunishments(message.guild, member, "ban");
										let overallCount = await Punish.getPunishments(message.guild, member, "overall");

			                var msg = "**Total Number of Warnings** » " + warnCount + "\n";
			                msg += "**Total Number of Bans** » " + banCount + "\n";
			                msg += "**Total Cases** » " + overallCount;

			                embed.addField("Punishment History", msg, true);

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

											embed.setFooter("User ID: " + member.user.id);
											message.channel.send({
													embed
											});
										}

                message.delete();
        }).catch(function(reason) {
            console.log(reason)

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
        return;
    } else {
        client.users.fetch(args).then(function(user) {
            const embed = new Discord.MessageEmbed();
            embed.setAuthor("ᴜꜱᴇʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ » " + user.tag, user.avatarURL({
                format: 'png'
            }));
            embed.setDescription("This user is not a part of this server.")
            embed.setColor("#c64ed3"); {
                var msg = "**Created** » " + user.createdAt.toDateString() + " at " + user.createdAt.toLocaleTimeString() + "\n";

                embed.addField("Timestamps", msg, true);
            } {
                var msg = "**Username** » " + user.username + "\n";
                embed.addField("Names", msg, true);
            } {
							let warnCount = 0;
							let banCount = 0;
							let overallCount = 0;

                rl.on('line', function(line) {
                    if (line.includes(user.id)) {
                        overallCount = overallCount + 1
                    }

                    if (line.includes("warn") && line.includes(user.id)) {
                        warnCount = warnCount + 1
                    } else if (line.includes("ban") && line.includes(user.id)) {
                        banCount = banCount + 1
                    }
                });

                rl.on('close', function(close) {
                    var msg = "**Total Number of Warnings** » " + warnCount + "\n";
                    msg += "**Total Number of Bans** » " + banCount + "\n";
                    msg += "**Total Cases** » " + overallCount;

                    embed.addField("Punishment History", msg);

                    embed.setFooter("User ID: " + user.id);
                    message.channel.send({
                        embed
                    });

                    message.delete();
                });
            }
            return;
        });
    }
}

let command = 'uinfo'
, description = 'View specific information on a user.'
, usage = 'uinfo **[user]**'
, throttle = {usages: 3, duration: 10}
, permission = 'mod';
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
