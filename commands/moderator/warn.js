const Discord = require('discord.js');
const fs = require('fs');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
var colors = require('colors');

var moderatorWarn = "";
var warnReason = "";
var warnMember = "";
var warningCount = 0;
var warnConfirm = false;

exports.run = (client, message, args) => {
	
    if (warnConfirm == true && warnMember !== null) {
		
		moderatorWarn = moderatorWarn.toString();
		warnMember = warnMember.toString();
		warnMember = warnMember.replace("<", "").replace(">", "").replace("@", "").toString();

		var date = new Date();
		var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

        warnConfirm = false;
        message.guild.fetchMember(warnMember).then(function(member) {
			
            //Write warning information to .csv file
			console.log("Write to CSV")
            var writer = csvWriter({
                headers: ["Discord Username", "Date (in GMT)", "Type of Punishment", "Punished by", "Reason"],
                sendHeaders: false
            })
            writer.pipe(fs.createWriteStream('punishment tracker.csv', {
                flags: 'a'
            }))
            writer.write([member.displayName + "#" + member.user.discriminator, dateString, "Warning", moderatorWarn.username, warnReason])
            writer.end()
            console.log(colors.green("* Successfully wrote warning for user '" + colors.underline(member.displayName) + "' to CSV file."));
			
			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 15056925,
					author: {
						name: "ᴡᴀʀɴɪɴɢ »  " + member.user.tag,
						icon_url: member.user.avatarURL( {format: 'png'} )
					},
					description: ":warning: <@" + member.id + "> has received a warning.\n",
					fields: [{
							name: '**User**',
							value: "<@" + member.id + ">"
						},
						{
							name: '**Moderator**',
							value: moderatorWarn
						},
						{
							name: '**Reason**',
							value: warnReason
						},
						{
							name: '**Warning #**',
							value: warningCount + 1
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
						icon_url: member.user.avatarURL( {format: 'png'} )
					},
					description: ":warning: You have received a warning on Rainbow Gaming.\n",
					fields: [{
							name: '**Reason**',
							value: warnReason
						}
					],
					timestamp: new Date()
				}
			});
			
			message.channel.send(":white_check_mark: " + member.displayName + " was successfully warned.");
            warningCount = 0;
            warnMember = null;
        });
        return;
    }

    if (message.member.roles.find("name", "Adept Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
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
            warnMember = member;
            if (member.roles.find("name", "Fleece Police")) {
                message.channel.send(':no_entry_sign: **ERROR:** You can\'t warn other moderators.');
            } else {
                if (warning == ("")) {
                    message.reply(':no_entry_sign: **NOPE:** You are warning **' + member.displayName + '** without a reason. You should go back and give a reason as to why you are giving the warning.');
                } else {
                    
                    moderatorWarn = message.author;

                    const rl = readline.createInterface({
                        input: fs.createReadStream('./punishment tracker.csv')

                        //Retrieve warning count info early so that it is ready to use when the user confirms the warn.

                    });
					console.log("getting lines")
                    rl.on('line', function(line) {
                        if (line.includes("Warning") && line.includes(member.displayName + "#" + member.user.discriminator)) {
                            warningCount = warningCount + 1
                        }
                    });

                    message.reply(':oncoming_police_car: You are about to warn **' + member.displayName + '** for *' + warning + '*. To confirm, type in `mod:warn`.');
                    warnConfirm = true;
					exports.warnMember = warnMember;
					exports.warnConfirm = warnConfirm;
                }
            }
        }).catch(function(reason) {

            if (warnConfirm == false && warnMember == null) {
                message.reply(':no_entry_sign: **ERROR:** You need to enter a user to warn. See mod:help for more information.');
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