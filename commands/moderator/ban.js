const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');

var banReason = {};
var moderatorBan = {};
var banMember = null;
var banConfirm = false;

exports.run = (client, message, args) => {

    console.log(banConfirm);
    if (banConfirm == true) {
        banConfirm = false;
        message.guild.fetchMember(banMember).then(function(member) {
            embed = new Discord.RichEmbed("ban");
            embed.setAuthor("??? » " + member.displayName + "#" + member.user.discriminator, member.user.displayAvatarURL);
            embed.setColor("#af1c1c");

            var date = new Date();
            var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

            //Write ban information to .csv file
            var writer = csvWriter({
                headers: ["Discord Username", "Date (in AEST)", "Type of Punishment", "Punished by", "Reason"],
                sendHeaders: false
            })
            writer.pipe(fs.createWriteStream('punishment tracker.csv', {
                flags: 'a'
            }))
            writer.write([member.displayName + "#" + member.user.discriminator, dateString, "Ban", moderatorBan, banReason])
            writer.end()
            console.log("* Successfully wrote ban for user '" + member.displayName + "' to CSV file.")

            var msg = banMember + "\n";
            embed.addField("**User**", msg);

            var msg = moderatorBan + "\n";
            embed.addField("**Moderator**", msg);

            var msg = banReason + "\n";
            embed.addField("**Reason**", msg);
            embed.setFooter(dateString);


            banMember.sendMessage(":warning: You have been permanently banned from Rainbow Gaming.");
            embeduser = new Discord.RichEmbed("ban-for-user");
            embeduser.setAuthor("??? »  " + banMember.displayName + "#" + banMember.user.discriminator, banMember.user.displayAvatarURL);
            embeduser.setColor("#af1c1c");
            var msg = banReason + "\n";
            embeduser.addField("**Reason**", msg);

            var msg = dateString + "\n";
            embeduser.addField("**Timestamp**", msg);

            banMember.sendEmbed(embeduser);

            message.channel.send(":white_check_mark: " + banMember.displayName + " was successfully banned.");
            client.channels.get("229575537444651009").sendEmbed(embed);
            message.guild.ban(banMember, 7);
            banMember = null;

        });
        return;
    }

    doNotDelete = true;
    if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
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

        message.guild.fetchMember(args.split(" ").toString()).then(function(member) {
            banMember = member;
            if (member.roles.find("name", "Fleece Police")) {
                message.channel.send(':no_entry_sign: **ERROR:** You can\'t ban other moderators.');
            } else {
                if (ban == ("")) {
                    message.reply(':no_entry_sign: **NOPE:** You are banning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are banning them.');
                } else {
                    banConfirm = true;
                    moderatorBan = message.author;
                    message.reply(':oncoming_police_car: You are about to ban **' + member.displayName + '** for *' + ban + '*.\n:no_entry: **Bans are only meant to be issued under serious circumstances, and if used incorrectly will lead to consequences.**\nTo confirm, type in `mod:ban`.');
                }
            }
        }).catch(function(reason) {
            if (banConfirm == false && banMember == null || ("") || undefined) {
                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to ban. See mod:help for more information.');
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

    message.delete();
}