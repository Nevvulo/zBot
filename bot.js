/****************************************
 *
 *   XailBot: Moderation bot designed for Rainbow Gaming.
 *   Copyright (C) 2017 Victor Tran and Rylan Arbour
 *	 Rewritten by zBlake
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * *************************************/
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const api = require('./keys.js');
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const yt = require('ytdl-core');
//This is just to make the console look fancier
var colors = require('colors');
const replace = require("replace");
const sql = require('sqlite');
sql.open('./score.sqlite');

const expletiveFilter = require('./commands/moderator/filter.js');
const doModeration = require('./commands/moderator/mod.js');
const panicMode = require('./commands/moderator/panic.js');
const debug = require('./commands/debug/toggle.js');

var newLevelReplace = {}
var lineExists = {};
var level = {};
var levelExp = {};
var oldLevelExp = {};
var activityScore = {};
var npToggle = false;
var lastMessages = {};
var fastMessage = {};
var fastMessageCount = {};
var sameMessageCount = {};
var smallMessageCount = {};
var lastUserInteraction = {};
var poweroff = false;
var warnMember = null;
var banMember = null;
var numDel;
var botDelMessage = {};
var warnReason = {};
var banReason = {};
var moderatorWarn = {};
var moderatorBan = {};
var doNotDelete = {};
var muteMember = null;
var moderatorMute = {};
var muteReason = {};
var warningCount = 0;
var permitMember = {};
var queue = [];
var music = {};
var skipCount = 3;
var currentSong = {};
var usersVotedSkip = [];
var queueList = "";
var songRepeat = false;
var tosend = [];
var musicEnd = false;

var totalMessagesDeleted = {};

var userAFK = [];

var caughtSwear = false;
var caughtSpam = false;
var caughtFastSpam = false;
var caughtLink = false;
var caughtKYS = false;
var ignoreMessage = false;

doModeration[196793479899250688] = true;

function setGame() {
    var presence = {};
    presence.game = {};
    presence.status = "online";
    presence.afk = false;
	
    switch (Math.floor(Math.random() * 1000) % 22) {
        case 0:
            presence.game.name = "with various buttons";
            break;
        case 1:
            presence.game.name = "xail's stream";
            break;
        case 2:
            presence.game.name = "xail is a nerd";
            break;
        case 3:
            presence.game.name = "with an internal bug";
            break;
        case 4:
            presence.game.name = "blake is a legend";
            break;
        case 5:
            presence.game.name = "bot games";
            break;
        case 6:
            presence.game.name = "with ones and zeroes";
            break;
        case 7:
            presence.game.name = "bot things";
            break;
        case 8:
            presence.game.name = "with supa weapon";
            break;
        case 9:
            presence.game.name = "with puzzles";
            break;
        case 10:
            presence.game.name = "rewinding time";
            break;
        case 11:
            presence.game.name = "checking archives";
            break;
        case 12:
            presence.game.name = "being unbreakable";
            break;
        case 13:
            presence.game.name = "with sandwiches";
            break;
        case 14:
            presence.game.name = "with other bots";
            break;
        case 15:
            presence.game.name = "Pokèmon";
            break;
        case 16:
            presence.game.name = "the waiting game";
            break;
        case 17:
            presence.game.name = "bending space";
            break;
        case 18:
            presence.game.name = "with hexagons";
            break;
        case 19:
            presence.game.name = "with space and time";
            break;
        case 20:
            presence.game.name = "being a ninja";
            break;
        case 21:
            presence.game.name = "bot:help for more info";
            break;
    }
	
    client.user.setPresence(presence);
}

client.on('ready', () => {
    console.log(" ");
    console.log(" ");
    console.log("● XailBot is ready!");
    console.log(" ");
    console.log(" ");
    client.setInterval(setGame, 300000);
    setGame();

});

function warningIcon(guild) {
    return ":warning:";
}

//var prank = true;
//IT'S JUST A PRANK BRO



function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

function aestTime() {
    var localtime = new Date();

    var date = new Date(localtime.valueOf() + (localtime.getTimezoneOffset() + +10 * 60) * 60000);
    var dateString = date.toString();

    localtime.setTime(localtime.getTime() + (60 * 60 * 1000));
}



function messageChecker(oldMessage, newMessage) {
    var message;

    if (newMessage == null) {
        message = oldMessage;
    } else {
        message = newMessage;
    }
    var msg = message.content;

    if (message.guild == null) return;

	exports.userAFK = userAFK;
	
    if (message.mentions.users.size > 0 && message.author.bot == false) {
        if (userAFK.indexOf(message.mentions.users.first().id) > -1) {
            message.channel.send(":information_source: " + message.mentions.users.first().username + " is currently AFK. They may not respond to your message for a while.");
        }
    } else {

    }

	//Activity tracker
	message.guild.fetchMember(message.author).then(function(member) {
	if (message.author.bot) {
		return;
	}
	const filter = message => message.author.id === member.user.id && member.user.bot == false;
	message.channel.fetchMessages({ limit: 100 }).then(messages => {
		if (message.author.bot) return;
		  if (message.channel.type !== 'text') return;

		  sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
			if (!row) {
			  sql.run('INSERT INTO scores (userId, experience, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
			} else {
			  let curLevel = 0
			  if (`${row.level}` == 0 && `${row.experience}` > 100) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 1 && `${row.experience}` > 250) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 2 && `${row.experience}` > 500) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 3 && `${row.experience}` > 750) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 4 && `${row.experience}` > 1000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 5 && `${row.experience}` > 1250) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 6 && `${row.experience}` > 1500) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 7 && `${row.experience}` > 1750) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 8 && `${row.experience}` > 2000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 9 && `${row.experience}` > 2500) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 10 && `${row.experience}` > 3000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 11 && `${row.experience}` > 4000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 12 && `${row.experience}` > 5000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 13 && `${row.experience}` > 6000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 14 && `${row.experience}` > 7000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 15 && `${row.experience}` > 8000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 16 && `${row.experience}` > 9001) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 17 && `${row.experience}` > 10000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 18 && `${row.experience}` > 11000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 19 && `${row.experience}` > 12000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				} else if (`${row.level}` == 20 && `${row.experience}` > 13000) {
					sql.run(`UPDATE scores SET level = ${row.level + 1} WHERE userId = ${message.author.id}`);
				}
			  
			  sql.run(`UPDATE scores SET experience = ${row.experience + 1} WHERE userId = ${message.author.id}`);
			}
		  }).catch(() => {
			console.error;
			sql.run('CREATE TABLE IF NOT EXISTS scores (userId TEXT, experience INTEGER, level INTEGER)').then(() => {
			  sql.run('INSERT INTO scores (userId, experience, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
			});
		  });

			
		  sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
		  console.log(`This user has ${row.experience} experience.`);
		  });
	
	let badges = JSON.parse(fs.readFileSync('./badges.json', 'utf8'));

		  // if the user has no badges, init to false.
		  if (!badges[message.author.id]) badges[message.author.id] = {
			developer: 0,
			active: 0,
			moderator: 0,
			essaywriter: 0,
			subscriber: 0,
			streamer: 0
		  };		
			let userBadges = badges[message.author.id];
		
		//If developer:
			if (message.author.id == 246574843460321291) {
				userBadges.developer = 1;
			}
			
		//If moderator:
			if (member.roles.find("name", "Fleece Police")) {
				userBadges.moderator = 1;
			}
			
		//If active:
			if (member.id == 246574843460321291 || member.id == 284551391781978112 || member.id == 184050823326728193 || member.id == 246129294785380353 || member.id == 224472981571633153 || member.id == 213776985581813760 || member.id == 213776985581813760) { // add id's here if active
				userBadges.active = 1;
			}
			
		//If subscriber:
			if (member.roles.find("name", "Subscriber")) {
				userBadges.subscriber = 1;
			}
			
		//If user has been typing for more then 1 minute:
			if (member.user.typingDurationIn(message.channel) > 60000) {
				userBadges.essaywriter = 1;
			}
			
		//If user is streamer:
			if (message.author.id == 196792235654774784) {
				userBadges.streamer = 1;
			}
			
		  fs.writeFile('./badges.json', JSON.stringify(badges), (err) => {
			if (err) console.error(err)
		  });
	
	})
	})
	
	if (debug.debugEnabled == true) {
	if (message.content.startsWith("debug.ToggleNowPlaying")) {
		if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
		message.delete();
		if (npToggle == true) {
			npToggle = false;
			exports.npEnabled = true;
			embed = new Discord.RichEmbed("test");
            embed.setAuthor("ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴠᴇ ᴛᴏᴏʟꜱ");
            embed.setColor("#f4bf42"); {
			message.channel.send();
			var emsg = ":white_check_mark: **Music: Now Playing function** has been toggled *on*.";
                embed.addField("Function toggled", emsg);
			}
			message.channel.sendEmbed(embed);
		} else {
			npToggle = true;
			exports.npEnabled = false;
			embed = new Discord.RichEmbed("test");
            embed.setAuthor("ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴠᴇ ᴛᴏᴏʟꜱ");
            embed.setColor("#f4bf42"); {
			var fmsg = ":white_check_mark: **Music: Now Playing function** has been toggled *off*.";
                embed.addField("Function toggled", fmsg);
			}
			message.channel.sendEmbed(embed);
		}
		} else {
			message.reply(':no_entry_sign: **NOPE:** What? You\'re not an administrator! Why would you be allowed to type that!?');
		}
	
	} else if (message.content.startsWith("debug.ListModerators")) {
		if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
		embed = new Discord.RichEmbed("test");
            embed.setAuthor("ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴠᴇ ᴛᴏᴏʟꜱ");
            embed.setColor("#f4bf42"); {
			var emsg = ":white_check_mark: Currently there are **" + message.guild.roles.get("268886465927315457").members.size + "** members with the 'Fleece Police' role (meaning they are moderators).\n";
                embed.addField("Current list of moderators", emsg);
			}
			message.channel.sendEmbed(embed);
		} else {
			message.reply(':no_entry_sign: **NOPE:** What? You\'re not an administrator! Why would you be allowed to type that!?');
		}
		} 
		
		else if (message.content.startsWith("debug.BotInfo")) {
			if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
		embed = new Discord.RichEmbed("test");
            embed.setAuthor("ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴠᴇ ᴛᴏᴏʟꜱ");
            embed.setColor("#f4bf42"); {
			
			var uptime = Math.round(client.uptime / 60000);
			var minOrHour = "minutes";
			
			if (client.uptime > 3600000) {
			uptime = Math.round(client.uptime / 600000);
			minOrHour = "hours";
			}
			
			let data = `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} / ${Math.round(process.memoryUsage().heapTotal / 1024)}MB`;
			var emsg = "**Uptime**: " + uptime + " " + minOrHour + "\n**Logged in as user:** " + client.user.username + "\n**Memory Usage:** " + data;
                embed.addField("Bot Debug Information", emsg);
			}
	
			message.channel.sendEmbed(embed);
			} else {
			message.reply(':no_entry_sign: **NOPE:** What? You\'re not an administrator! Why would you be allowed to type that!?');
		}
		}
		
	}
	
	
    if (message.content.startsWith("bot:r") && message.author.id == "246574843460321291") {
		message.delete();
		message.reply(':arrows_counterclockwise: **SAFE REBOOT:** Forcing all currently loaded modules to stop and rebooting Xail Bot.');
		message.channel.send(":white_check_mark: We'll be back in a bit.").then(function() {
			client.destroy();
			client.login(api.key()).then(function() {
				message.channel.send(":white_check_mark: **Xail Bot** is back online!");
			}).catch(function() {
				console.log("[ERROR] Login failed.");
			});
		});
	}
	
	
    const prefix = ";";
    const argseval = message.content.split(" ").slice(1);

    if (message.content.startsWith(prefix + "eval") && message.author.id == "246574843460321291") {
		ignoreMessage = true;
        try {
            var code = argseval.join(" ");
            var evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            message.delete();
            embed = new Discord.RichEmbed("test");
            embed.setAuthor("ᴇᴠᴀʟ ʀᴇꜱᴜʟᴛ » ");
            embed.setColor("#7d42f4"); {
                var emsg = `\`\`\`js\n${clean(code)}\n\`\`\``;
                embed.addField(":inbox_tray: **Input**", emsg);
            }

            {
                var emsg = `\`\`\`js\n${clean(evaled)}\n\`\`\``;
                embed.addField(":outbox_tray: **Output**", emsg);
            }

            message.channel.sendEmbed(embed).then(m => {

                m.react("✅");
            })
        } catch (err) {
            message.delete();
            embed = new Discord.RichEmbed("test");
            embed.setAuthor("ᴇᴠᴀʟ ᴇʀʀᴏʀ » ");
            embed.setColor("#720d0d");

            {
                var emsg = `\`\`\`xl\n${clean(err)}\n\`\`\``;
                embed.addField(":no_entry_sign: **Error**", emsg);
            }

            message.channel.sendEmbed(embed).then(m => {
                m.react("❌");
                m.react(":xailFish:303393341704503297");
            })
        }
    }

    if (botDelMessage == null) {
        botDelMessage = true;
    }

    if (doModeration.enabled == null || undefined) {
        doModeration.enabled = true;
    }

    if (expletiveFilter.enabled == null || undefined) {
        expletiveFilter.enabled = true;
    }

	exports.doNotDelete = doNotDelete;
	//console.log(doNotDelete);
	
    if (botDelMessage) {
        if (message.author.id == 303017211457568778 && doNotDelete == false) {
            console.log(colors.yellow("▲ Bot is about to delete: " + colors.grey(message)));
            message.delete(10000);
        }
    }

    if (panicMode.enabled == undefined) {
        panicMode.enabled = false;
    }

    if (panicMode.enabled) {
        message.delete();
    }

    if (message.author.id !== 303017211457568778 && !message.author.bot) {
        if (doModeration.enabled) { //Check if we should do moderation on this server

            //ALL FUNCTION STUFF IS CHECKING IF THE FIRST WORD OF THE STRING IS PRESENT MORE THAN [X] AMOUNT OF TIMES, NEEDS MORE WORK
            function regexEscape(str) {
                if (str == null) return;
                return str.toString().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            }

            function reg(input) {
                var flags;
                //could be any combination of 'g', 'i', and 'm'
                flags = 'gi';

                if (input == null) return;
                input = regexEscape(input);

                return new RegExp('[a-zA-Z ](' + input + '){10,}', flags);
            }


            //This below code is testing how many characters in a single post, and if there are more than 17 (subject to change) then delete message.
            //Check for spam in a single message
            console.log(colors.gray("MESSAGE: " + message.author.username + " » " + msg));
			
            if (/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?(.)\9{17,}[^0-9]/gi.test(msg) == true) {
                caughtSpam = true;
                message.delete()
                return;
            } else if (reg(msg.match(/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?^(\S+)\s/gi)) !== undefined) {
                if (reg(msg.match(/(\*(\*))?(~~)?(`)?(__(\*)(\*\*)(\*\*\*))?^(\S+)\s/gi)).test(msg) == true) {
                    ignoreMessage = true;
                    message.delete()
                    return;
                }
            }

            //Spam limiting
            if (lastMessages[message.author.id] != msg) {
                sameMessageCount[message.author.id] = 0;
            }
			
			if (message.channel.name == "photos") {
			return;
			}
            lastMessages[message.author.id] = msg
            sameMessageCount[message.author.id] += 1;

            if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] == 6) {
                var auth = message.author;
                client.channels.get("229575537444651009").send(warningIcon(message.guild) + " **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");
                doNotDelete = false;
                message.reply("Quite enough of this. I'm not warning you any more. A notification has been sent to the mods.");
    			caughtSpam = true;
				message.delete();
            } else if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 6) {
				ignoreMessage = true;
				message.delete();
            } else if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] > 3) {
				ignoreMessage = true;
                doNotDelete = false;
                console.log(colors.bold(colors.yellow("▲ Spam limits kicking in!")));
                switch (Math.floor(Math.random() * 1000) % 5) {
                    case 0:
                        message.reply("Well... We all heard you.");
                        break;
                    case 1:
                        message.reply("Stop typing the same thing! You're like a broken record!");
                        break;
                    case 2:
                        message.reply("Hmm... Not sure if you'd actually say the same thing more than three times in public.");
                        break;
                    case 3:
                        message.reply("Is that the only phrase you know? Can you try typing something else?");
                        break;
                    case 4:
                        message.reply("Pollution is not the solution, my friend.");
                        break;
                }

                message.delete();
            } else if (smallMessageCount[message.author.id] == 6) {
                var auth = message.author;
                client.channels.get("229575537444651009").send(warningIcon(message.guild) + " **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");
                doNotDelete = false;
                message.reply("Quite enough of this. I'm not warning you any more. A notification has been sent to the mods.");
                caughtSpam = true;
				message.delete();
            } else if (smallMessageCount[message.author.id] > 6) {
                ignoreMessage = true;
				message.delete();
            } else if (smallMessageCount[message.author.id] > 5) {
                ignoreMessage = true;
				console.log(colors.bold(colors.yellow("▲ Spam limits kicking in!")));
                doNotDelete = false;
                switch (Math.floor(Math.random() * 1000) % 4) {
                    case 0:
                        message.reply("This looks like spam. And we don't like spam.");
                        break;
                    case 1:
                        message.reply("Cut it out.");
                        break;
                    case 2:
                        message.reply("Very... scribbly...");
                        break;
                    case 3:
                        message.reply("If you're going to type that, why not get out a pen and paper and do it yourself?");
                        break;
                }
				
                message.delete();
            }
		

            if (expletiveFilter.enabled) {
                //Check for expletives
                var exp = msg.search(/(\b|\s|^|\.|\,|\ )(fuck|fucks|fuckin|fucking|penis|cunt|faggot|fark|fck|fag|wank|wanker|nigger|nigga|bastard|bitch|asshole|dick|dickhead|d1ck|b1tch|b!tch|blowjob|cock|nigg|fuk|cnut|pussy|c0ck|retard|stfu|porn)(\b|\s|$|\.|\,|\ )/i);
                if (exp != -1) { //Gah! They're not supposed to say that!
                    console.log(colors.bold(colors.yellow("▲ Expletive caught at " + parseInt(exp))));
                    switch (Math.floor(Math.random() * 1000) % 21) {
                        case 0:
                            message.reply("I'm very disappointed in you. :angry:");
                            break;
                        case 1:
                            message.reply("Hey! Let's not have any of that please.");
                            break;
                        case 2:
                            message.reply("No thanks.");
                            break;
                        case 3:
                            message.reply("Cool. Now let's not forget the rules.");
                            break;
                        case 4:
                            message.reply("If I'm not going to delete it, a mod will. Let's save them some work.");
                            break;
                        case 5:
                            message.reply("Hey! That was a swear! No!");
                            break;
                        case 6:
                            message.reply("This situation calls for some passive resistance!");
                            break;
                        case 7:
                            message.reply("Hey! Just cool it.");
                            break;
                        case 8:
                            message.reply("Watch your mouth.");
                            break;
                        case 9:
                            message.reply("I can't believe you've done this...");
                            break;
                        case 10:
                            message.reply("Did you have to say that?");
                            break;
                        case 11:
                            message.reply("You can't say that man!");
                            break;
                        case 12:
                            message.reply("You've triggered me!");
                            break;
                        case 13:
                            message.reply("Woah! Calm down buddy!");
                            break;
                        case 14:
                            message.reply("Won't somebody please just think about the children?");
                            break;
                        case 15:
                            message.reply("Was that necessary?");
                            break;
                        case 16:
                            message.reply("I think you might need to have a quick look at the rules again.");
                            break;
                        case 17:
                            message.reply("Gah! You can't say that!");
                            break;
                        case 18:
                            message.reply("You can't use those words here.");
                            break;
                        case 19:
                            message.reply("If you're going to type that, why not get out a pen and paper and do it yourself?");
                            break;
                        case 20:
                            message.reply("♫ God I wish I never spoke, now I gotta wash my mouth out with soap ♫");
                            break;
                    }
                    doNotDelete = false;
                    caughtSwear = true;
                    message.delete();
                    return;
                }
            }

            if (message.author.id != 303017211457568778 && msg.search(/\b(kys|kill yourself)\b/i) != -1) {
                var auth = message.author;
                caughtKYS = true;
                message.reply("Right. We don't appreciate that here. A notification has been sent to the mods.");
                message.delete();
            }

            if (message.member != null) { //*!(message.member.roles.find("name", "Fleece Police"))
                exp = msg.search(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{5,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i);
                if (exp != -1) { //This is a link.
                    if (message.member.roles.find("name", "Fleece Police") || message.member.roles.find("name", "Permitted")) {

                    } else if (message.channel.name == "self_promos" || message.channel.name == "music" || message.channel.name == "bot_testing" || message.channel.name == "meme_dungeon") {

                    } else if (msg.toLowerCase().includes("https://twitch.tv/xailran") || msg.toLowerCase().includes("https://www.youtube.com")) {

                    } else {
                        caughtLink = true;
                        console.log(colors.yellow(colors.bold("Link caught at " + parseInt(exp))));
                        switch (Math.floor(Math.random() * 1000) % 6) {
                            case 0:
                                message.reply("I've replaced your link with a not-so-link-like link: click here");
                                message.delete();
                                break;
                            case 1:
                                message.reply("Whatever that link was... I hope it didn't contain some bad stuff...");
                                message.delete();
                                break;
                            case 2:
                                message.reply("I don't know man, the internet is a dangerous place.");
                                message.delete();
                                break;
                            case 3:
                                message.reply("Cool. Now let's not forget the rules.");
                                message.delete();
                                break;
                            case 4:
                                message.reply("If I'm not going to delete it, a mod will. Let's save them some work.");
                                message.delete();
                                break;
                            case 5:
                                message.reply("We don't want to download your FREE RAM.");
                                message.delete();
                                break;
                        }

                    }

                }
            }

        }
    }

    if (message.mentions !== null && message.mentions.users !== null) {
        doNotDelete = true;

        if (message.mentions.users.has("303017211457568778")) {
			if (message.channel.name == "bot_testing") {
				
			}
			
            if (message.channel.name !== "other_stuff" && message.channel.name !== "bot_testing" && msg.toLowerCase().startsWith("mod:") !== true) {
				doNotDelete = false;
                message.delete();
                message.channel.send(":no_entry_sign: **NOPE**: You need to be in <#297684608940769283> if you want to chat with me.");
                return;
            }

            if (msg.toLowerCase().includes("stop") || (msg.toLowerCase().includes("shut") && msg.toLowerCase().includes("up"))) {

                switch (Math.floor(Math.random() * 1000) % 3) {
                    case 0:
                        message.reply(":no_entry_sign: **NOPE**: I shall talk as much as I like.");
                        break;
                    case 1:
                        message.reply(":no_entry_sign: **NOPE**: You shu... I'd better not say that actually.");
                        break;
                    case 2:
                        message.reply(":no_entry_sign: **NOPE**: Just no.");
                        break;
                }
                //CONVERSATION COMMANDS
            } else if (msg.toLowerCase().includes("fuck you") || msg.toLowerCase().includes("fuck off") || msg.toLowerCase().includes("shit")) {
                message.reply("Want a :hammer:?");
            } else if (msg.toLowerCase().includes("how") && msg.toLowerCase().includes("you")) {
                message.reply("I'm doing OK I suppose.");
            } else if (msg.toLowerCase().includes("yes") || msg.toLowerCase().includes("yep") || msg.toLowerCase().includes("right?") || msg.toLowerCase().includes("isn't it?")) {
                message.reply("Well, I suppose so.");
            } else if (msg.toLowerCase().includes("no") || msg.toLowerCase().includes("nope")) {
                message.reply("I guess not.");
            } else if (msg.toLowerCase().includes("do you")) {
                message.reply("Erm... Maybe? I dunno.");
            } else if (msg.toLowerCase().includes("what is")) {
                message.reply("It's probably 42.");
            } else if (msg.toLowerCase().includes("donate")) {
                message.reply(":information_source: You can donate to Xailran by clicking this link: https://twitch.streamlabs.com/xailran#/ \n:no_entry_sign: Please note that you are absolutely not required to donate to Xail. All donations, no matter the size, are massively welcomed though.");
            } else if (msg.toLowerCase().includes("are you")) {
                message.reply("If that's what you want, okay.");
            } else if (msg.toLowerCase().includes("why is")) {
                message.reply("I don't know, it's probably because of something Xail did.");
            } else if (msg.toLowerCase().includes("can i")) {
                message.reply("It's up to you, mate.");
            } else if (msg.toLowerCase().includes("hello") || msg.toLowerCase().includes("hi")) {

                switch (Math.floor(Math.random() * 1000) % 6) {
                    case 0:
                        message.reply("Is it me you're looking for?");
                        break;
                    case 1:
                        message.reply("Hey there! If you ever need help using Xail Bot, just type `bot:help`!");
                        break;
                    case 2:
                        message.reply("Hello there!");
                        break;
                    case 3:
                        message.reply("Woah, hey there " + message.author + "! Didn't know you were here!");
                        break;
                    case 4:
                        message.reply("A wild " + message.author + " appeared!");
                        break;
                }

                //USER-SPECIFIC COMMANDS
            } else if (msg.toLowerCase().includes("xail") || msg.toLowerCase().includes("xailran")) {
                message.reply("Did you know I am actually based off of that guy?");
            } else if (msg.toLowerCase().includes("zblake") || msg.toLowerCase().includes("blake")) {
                message.reply("Oh, I know that guy! He's an absolute legend.");
            } else if (msg.toLowerCase().includes("pooma") || msg.toLowerCase().includes("pumacatrun2")) {
                switch (Math.floor(Math.random() * 1000) % 4) {
                    case 0:
                        message.reply("same");
                        break;
                    case 1:
                        message.reply(":^)))))))))");
                        break;
                    case 2:
                        message.reply("same u nerd :^)))");
                        break;
                    case 3:
                        message.reply("puma exposed");
                        break;
                }
            } else if (msg.toLowerCase().includes("rocker")) {
                switch (Math.floor(Math.random() * 1000) % 4) {
                    case 0:
                        if (message.author.id == 213776985581813760) {
                            switch (Math.floor(Math.random() * 1000) % 3) {
                                case 0:
                                    message.author.sendMessage("IMMA FITEACHU LETS GO")
                                    break;
                                case 1:
                                    message.author.sendMessage("you're a derp")
                                    break;
                                case 2:
                                    message.author.sendMessage("https://www.youtube.com/watch?v=4ZaYk7X9KAU\nTHE MUUUSIICCC <3 <3 <3")
                                    break;
                            }
                        } else {
                            message.reply("rocker is smol");
                        }
                        break;
                    case 1:
                        message.reply("i like yo face " + message.author);
                        break;
                    case 2:
                        message.reply("boi.");
                        break;
                    case 3:
                        message.reply("*mew mew mew mew mew mew mew mew mew mew MEEWW*");
                        break;
                }
                //MEME COMMANDS
            } else if (msg.toLowerCase().includes("boy i sure do wish i could give money to xailran, he is just such a smart, funny guy that i want to give him funds to help his channel.")) {
                message.reply("That is a very specific request you have there!");
            } else if (msg.toLowerCase().includes("+") || msg.toLowerCase().includes("divided") || msg.toLowerCase().includes("-") || msg.toLowerCase().includes("plus") || msg.toLowerCase().includes("subtract") || msg.toLowerCase().includes("minus") || msg.toLowerCase().includes("times") || msg.toLowerCase().includes("*") || msg.toLowerCase().includes("/") || msg.toLowerCase().includes("=")) {
                message.reply("Sorry, I don't know what it is. Go ask Xail, he'd probably know.");
            } else if (msg.toLowerCase().includes("shut down") || msg.toLowerCase().includes("shut off") || msg.toLowerCase().includes("turn off") || msg.toLowerCase().includes("go away") || msg.toLowerCase().includes("shutdown")) {
                message.reply(":white_check_mark: XailBot is now exiting. Goodbye!");
                message.reply("Haha, just kidding.");
            } else if (msg.toLowerCase().includes("but first")) {
                message.reply("We need to talk about parallel universes.");
			
				//TAGS
			} else if (msg.toLowerCase().includes("tags")) {
                message.reply("**LIST OF ALL TAGS:**\n*PumaPls, Palahace, Meg, TroublesomeTrio, YoungProTeacher, Implicit, Padfoot, zBlake, Rocker*");
			} else if (msg.toLowerCase().includes("pumapls")) {
                message.reply("Puma is a troll, we all know it, and for some reason Xail tolerates her. End of story.");
			} else if (msg.toLowerCase().includes("palahace")) {
                message.reply("http://image.prntscr.com/image/867e0d4be5574b8786790b831d4e8632.png");
			} else if (msg.toLowerCase().includes("meg")) {
                message.reply("'If you're being camped, you are on your own!'");
			} else if (msg.toLowerCase().includes("troublesometrio")) {
                message.reply("What a beautiful union! https://clips.twitch.tv/xailran/CuriousLyrebirdOptimizePrime");
            } else if (msg.toLowerCase().includes("youngproteacher")) {
                message.reply("A wild British guy appeared. He used Cup of Tea. It was super effective.");
            } else if (msg.toLowerCase().includes("implicit")) {
                message.reply("Part time meme, part time gamer");
            } else if (msg.toLowerCase().includes("padfoot")) {
                message.reply("Harry Potter reference? Random name? Who knows");
            } else if (msg.toLowerCase().includes("zblake.")) {
                message.reply("Everything is confusing! Except programming. Programming is cool");
            //} else if (msg.toLowerCase().includes("Rocker")) {
            //    message.reply("the most smol of the mods (and cute)");
            //}
        }
	}
}
    
    if (msg.toLowerCase().startsWith("bot:")) {
		//Un-comment to activate Lockdown Mode. 	return message.channel.send(":no_entry_sign: **EMERGENCY**: *Xail Bot* has temporarily been placed in **LOCKDOWN MODE**. Learn more about why this has happened here: https://github.com/zBlakee/Xail-Bot/wiki/Lockdown-Mode");
        var command = msg.substr(4).split(" ").slice(0, 1);
        var args = msg.split(" ").slice(1);
		
		exports.commandIssuer = message.author.id;
		console.log(colors.bold(colors.bgBlue(colors.white(message.author.username + " issued command " + command))));
		
        try {
            let commandFile = require(`./commands/${command}.js`);
			if (command.toString().toLowerCase().includes("." || "/" || "moderator" || "debug")) {
			message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
			} else {
            commandFile.run(client, message, args);
			}
        } catch (err) {
			if (command.toString().toLowerCase().includes("." || "/" || "moderator" || "debug")) {
			message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
			}
			message.reply(":no_entry_sign: **NOPE**: That is not a valid command. You can type `bot:help` to see a list of all available commands.");
			console.error(colors.bold(colors.bgRed(colors.white(err))));
            console.error(colors.bold(colors.bgYellow(colors.white("This was most likely caused by the user not entering a valid command."))));
        }
    }

	
	
    if (msg.toLowerCase().startsWith("mod:")) {
        if (message.member.roles.find("name", "Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
            var command = msg.substr(4).split(" ").slice(0, 1);
            var args = msg.split(" ").slice(1);

			console.log(colors.bold(colors.bgBlue(colors.yellow(message.author.username + " issued moderator command " + command))));
			
            try {
                let commandFile = require(`./commands/moderator/${command}.js`);
                commandFile.run(client, message, args);
            } catch (err) {
                console.error(colors.bold(colors.bgRed(colors.white(err))));
				console.error(colors.bold(colors.bgYellow(colors.white("This was most likely caused by the user not entering a valid command."))));
            }
        } else {
            doNotDelete = false;
            message.reply(':no_entry_sign: **NOPE:** What? You\'re not a member of the staff! Why would you be allowed to type that!?');
            message.delete();
        }
    }
	
	    if (msg.toLowerCase().startsWith("debug:")) {
        if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
            var command = msg.substr(6).split(" ").slice(0, 1);
            var args = msg.split(" ").slice(1);

			console.log(colors.bold(colors.bgBlue(colors.red(message.author.username + " issued debug command " + command))));
			
            try {
                let commandFile = require(`./commands/debug/${command}.js`);
                commandFile.run(client, message, args);
            } catch (err) {
                console.error(colors.bold(colors.bgRed(colors.white(err))));
				console.error(colors.bold(colors.bgYellow(colors.white("This was most likely caused by the user not entering a valid command."))));
            }
        } else {
            doNotDelete = false;
            message.reply(':no_entry_sign: **NOPE:** What? You\'re not an administrator! Why would you be allowed to type that!?');
            message.delete();
        }
    }
}


client.on('message', messageChecker);
client.on('messageUpdate', messageChecker);

client.on('guildMemberAdd', function(guildMember) {
    if (guildMember.guild.id == 196793479899250688) {
        var channel;
        channel = client.channels.get("247177027839459338");

        embed = new Discord.RichEmbed("info");
        embed.setAuthor("ᴜꜱᴇʀ ᴊᴏɪɴᴇᴅ » " + guildMember.displayName, guildMember.user.displayAvatarURL);
        embed.setColor("#30b236");

        var msg = guildMember.user.discriminator + "\n"
        embed.addField("**Discriminator**", "#" + msg);

        var msg = guildMember.user.createdAt.toDateString() + " at " + guildMember.user.createdAt.toLocaleTimeString() + "\n";
        embed.addField("**User Created**", msg);

        if (guildMember.joinedAt.toUTCString() == "Thu, 01 Jan 1970 00:00:00 GMT") {
            msg = "Joined at: -∞... and beyond! Discord seems to be giving incorrect info... :(";
        } else {
            msg = guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString();
        }
        embed.addField("**User Joined**", msg);
        client.channels.get("247177027839459338").sendEmbed(embed);

    }
});

client.on('guildMemberRemove', function(guildMember) {
    if (guildMember.guild.id == 196793479899250688) {
        var channel;
        channel = client.channels.get("247177027839459338");

        embed = new Discord.RichEmbed("info");
        embed.setAuthor("ᴜꜱᴇʀ ʀᴇᴍᴏᴠᴇᴅ » " + guildMember.displayName, guildMember.user.displayAvatarURL);
        embed.setColor("#d16c2e");

        var msg = guildMember.displayName + "#" + guildMember.user.discriminator + "\n"
        embed.addField("**Username**", msg);

        if (guildMember.joinedAt.toUTCString() == "Thu, 01 Jan 1970 00:00:00 GMT") {
            msg = "Joined at: -∞... and beyond! Discord seems to be giving incorrect info... :(";
        } else {
            msg = guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString();
        }
        embed.addField("**User Joined**", msg);
        client.channels.get("247177027839459338").sendEmbed(embed);

    }
});

client.on('guildMemberUpdate', function(oldUser, newUser) {
	if (oldUser.user.bot == true) return;
    if (newUser.nickname != oldUser.nickname) {
        var channel = client.channels.get("247177027839459338"); //Admin Bot warnings
        if (newUser.nickname == null) {
            embed = new Discord.RichEmbed("warning");
            embed.setAuthor("ɴɪᴄᴋɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.username + "#" + oldUser.user.discriminator, oldUser.user.displayAvatarURL);
            embed.setDescription(oldUser.user.username + " has cleared their nickname.\nIt has now defaulted to their username.");
            embed.setColor("#42b3f4");

            var msg = oldUser.displayName + "\n";
            embed.addField("**Previous Name**", msg);


            client.channels.get("247177027839459338").sendEmbed(embed);
        } else {
            embed = new Discord.RichEmbed("warning");
            embed.setAuthor("ɴɪᴄᴋɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.username + "#" + oldUser.user.discriminator, oldUser.user.displayAvatarURL);
            embed.setColor("#42b3f4");

            var msg = oldUser.displayName + "\n";
            embed.addField("**Previous Name**", msg);

            var msg = newUser.nickname + "\n";
            embed.addField("**New Nickname**", msg);

            client.channels.get("247177027839459338").sendEmbed(embed);
        }
    }
});

client.on('userUpdate', function(oldUser, newUser) {
    if (newUser.guild != null) {
        if (newUser.guild.id == 196793479899250688) {
            if (newUser.username != oldUser.username) {
                var channel = client.channels.get("247177027839459338"); //Admin Bot warnings
                embed = new Discord.RichEmbed("warning");
                embed.setAuthor("ᴜsᴇʀɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.username + "#" + oldUser.user.discriminator, oldUser.user.displayAvatarURL);
                embed.setColor("#3698d1");

                var msg = oldUser.user.username + "\n";
                embed.addField("**Previous Username**", msg);

                var msg = newUser.user.username + "\n";
                embed.addField("**New Username**", msg);

                client.channels.get("247177027839459338").sendEmbed(embed);
            }
        }
    }
});

client.on('messageDelete', function(message) {
    if (message.content.startsWith("bot:") || message.content.startsWith("mod:")) return;
    var channel = null;

    if (message.guild != null) {

        if (message.guild.id == 196793479899250688) { //General chat for testbot
            channel = client.channels.get("229575537444651009");
        }

        if (panicMode[message.guild.id]) return; //Don't want to be doing this in panic mode!
        if (message.author.id == 303017211457568778) return;
        if (message.author.id == 155149108183695360) return; //Dyno
        if (message.author.id == 184405311681986560) return; //FredBoat
        if (ignoreMessage) {
		ignoreMessage = false;	
		return;
		}
			
		if (caughtKYS == true) {
            caughtKYS = false;

            embed = new Discord.RichEmbed("spamming");
            embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.username + "#" + message.member.user.discriminator, message.member.user.displayAvatarURL);
            embed.setColor("#e08743");
            embed.setDescription(":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was deleted.\n")

            var date = new Date();
            var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

            var msg = message.cleanContent;
            embed.addField("**Message**", msg);

            var msg = "Death threat contained in message.\n";
            embed.addField("**Reason**", msg);

            embed.setFooter(dateString);
            client.channels.get("229575537444651009").sendEmbed(embed);
		return;
		} else if (caughtSpam == true) {
            caughtSpam = false;

            embed = new Discord.RichEmbed("spamming");
            embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.username + "#" + message.member.user.discriminator, message.member.user.displayAvatarURL);
            embed.setColor("#e08743");
            embed.setDescription(":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was deleted.\n")

            var date = new Date();
            var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

            var msg = message.cleanContent;
            embed.addField("**Message**", msg);

            var msg = "Duplicated words/letters.\n";
            embed.addField("**Reason**", msg);

            embed.setFooter(dateString);
            client.channels.get("229575537444651009").sendEmbed(embed);
		return;
        } else if (caughtSwear == true) {
            caughtSwear = false;

            embed = new Discord.RichEmbed("swearing");
            embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.username + "#" + message.member.user.discriminator, message.member.user.displayAvatarURL);
            embed.setColor("#e08743");
            embed.setDescription(":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was deleted.\n")

            var date = new Date();
            var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

            var msg = message.cleanContent;
            embed.addField("**Message**", msg);

            var msg = "Expletives found in message.\n";
            embed.addField("**Reason**", msg);

            embed.setFooter(dateString);
            client.channels.get("229575537444651009").sendEmbed(embed);
		return;
        } else if (caughtLink == true) {
            caughtLink = false;

            embed = new Discord.RichEmbed("link");
            embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.username + "#" + message.member.user.discriminator, message.member.user.displayAvatarURL);
            embed.setColor("#e08743");
            embed.setDescription(":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was deleted.\n")

            var date = new Date();
            var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

            var msg = message.cleanContent;
            embed.addField("**Message**", msg);

            var msg = "Unconfirmed link contained in message.\n";
            embed.addField("**Reason**", msg);

            embed.setFooter(dateString);
            client.channels.get("229575537444651009").sendEmbed(embed);
		return;
		    }
	}
});
	//Commented out to try and find fix.
		
       // } else if (channel != null) {
       //     if (message.member.roles.find("name", "Fleece Police") || message.member.roles.find("name", "Head of the Flock")) {
       //         return;
       //     } else {
       //        embed = new Discord.RichEmbed("manual");
       //         embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.username + "#" + message.member.user.discriminator, message.member.user.displayAvatarURL);
       //         embed.setColor("#e08743");
       //         embed.setDescription(":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was deleted.\n")

       //         var date = new Date();
       //         var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

       //         var msg = message.cleanContent;
       //         embed.addField("**Message**", msg);

       //         var msg = "Message manually deleted by user.\n";
       //         embed.addField("**Reason**", msg);
       //         embed.setFooter(dateString);
       //         client.channels.get("229575537444651009").sendEmbed(embed);
       //         return;
       //     }
       // }


client.on('messageDeleteBulk', function(messages) {
    var channel = null;

    if (panicMode[messages.first().guild.id]) return; //Don't want to be doing this in panic mode!
    if (botDelMessage[messages.first().guild.id]) return;

    channel = client.channels.get("229575537444651009");

    if (channel != null) {
		console.log(colors.bold(colors.yellow("▲ " + numDel + " messages deleted using mod:rm.")));
    }

});

client.on('messageUpdate', function(oldMessage, newMessage) {
    if (oldMessage.cleanContent == newMessage.cleanContent) return; //Ignore
    var channel = null;
    if (oldMessage.guild != null) {
        if (oldMessage.guild.id == 196793479899250688) {
            channel = client.channels.get("247177027839459338");
        }

        if (channel != null) {
            if (oldMessage.author.id == 303017211457568778) return;
            if (oldMessage.author.id == 155149108183695360) return; //Dyno
			if (oldMessage.author.id == 184405311681986560) return; //FredBoat
            if (oldMessage.member.roles.find("name", "Fleece Police") || oldMessage.member.roles.find("name", "Head of the Flock")) {
                return;
            } else {
                embed = new Discord.RichEmbed("spamming");
                embed.setAuthor("ᴍᴇꜱꜱᴀɢᴇ ᴇᴅɪᴛᴇᴅ »  " + oldMessage.author.username + "#" + oldMessage.member.user.discriminator, oldMessage.member.user.displayAvatarURL);
                embed.setColor("#f4c242");
                embed.setDescription(":pencil: Message by <@" + oldMessage.author.id + "> in <#" + oldMessage.channel.id + "> was edited.\n")

                var date = new Date();
                var dateString = (date.toDateString() + " at " + date.toLocaleTimeString());

                var msg = oldMessage.cleanContent;
                embed.addField("**Old Content**", msg);

                var msg = newMessage.cleanContent;
                embed.addField("**New Content**", msg);

                embed.setFooter(dateString);
                client.channels.get("247177027839459338").sendEmbed(embed);
                return;
            }
        }
    }
});

process.on("unhandledRejection", err => {
    console.error(colors.bold(colors.bgRed(colors.white("[UNCAUGHT PROMISE] " + err.stack))));
});


client.login(api.key()).catch(function() {
    console.log(colors.bold(colors.bgRed(colors.white("[ERROR] Login failed."))));
    console.log("Failed to login with token: " + api.key());
});
