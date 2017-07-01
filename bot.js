/****************************************
 *
 *   Xail Bot: An all-in-one bot designed for Rainbow Gaming.
 *   Copyright (C) 2017 Victor Tran and Rylan Arbour
 *	 Rewritten and redesigned by zBlake
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
const maintenanceM = require('./commands/debug/maintenance.js');

//Maintenance check
var maintenance = false;
if (maintenanceM.maintenanceEnabled == true) {
	maintenance = true;
} else {
	maintenance = false;
}

const sql = require('sqlite');
sql.open('./score.sqlite');

const expletiveFilter = require('./commands/filter.js');
const doModeration = require('./commands/mod.js');
const panicMode = require('./commands/panic.js');
const debug = require('./commands/debug/toggle.js');
const Experience = require('./structures/profile/Experience');

var bulkC = 0;
var lineExists = {};
var npToggle = false;
var lastMessages = {};
var fastMessage = {};
var fastMessageCount = {};
var sameMessageCount = {};
var smallMessageCount = {};
var lastUserInteraction = {};
var numDel;
var botDelMessage = {};
var doNotDelete = {};
var talkedRecently = [];
var userAFK = [];
var mentionUserXBT;

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
	console.log("● Xail Bot is ready!");
	console.log(" ");
	console.log(" ");
	client.setInterval(setGame, 300000);
	setGame();
});

function clean(text) {
	if (typeof(text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
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
			message.channel.send(":information_source: " + message.mentions.users.first().username + " is currently AFK. They may not respond to your message for a while.").then(message => {
				message.delete({
					timeout: 8000
				});
			});
		}
	} else {}

	//✦ Check for a photo in message, if true, add 1 to photographer progress badge. ✦
	var badgecompletion = JSON.parse(fs.readFileSync('./data/badges/badge-progress.json', 'utf8'));

	if (!badgecompletion[message.author.id])
		badgecompletion[message.author.id] = {
			photographer: 0
		};

	//If user posts a picture in #photos, add 1 to photographer badge:
	if (message.author.bot) return;

	if (message.attachments.size > 0) {
		badgecompletion[message.author.id].photographer += 1;
	}

	//✦ Experience handler, including levels, badges and experience gained per message. ✦
	message.guild.fetchMember(message.author).then(function(member) {
		const filter = message => message.author.id === member.user.id && member.user.bot == false;
		message.channel.fetchMessages({
			limit: 100
		}).then(messages => {
			if (message.author.bot)
				return;
			if (message.channel.type !== 'text')
				return;
			if (message.channel.id == 325540027972976650)
				return;

			sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {

				if (!row) {
					sql.run('INSERT INTO scores (userId, experience, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
					console.log("Added new user to database.");
				} else {
					let curLevel = Math.floor(0.1 * Math.sqrt(row.experience)) + 1;
					if (curLevel > row.level) {
						row.level = curLevel;
						sql.run(`UPDATE scores SET experience = ${row.experience + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
					}
					// Checks if they have talked recently
					if (talkedRecently.includes(message.author.id)) {
						// You can change the nature of the cool down by changing the return to something else.
						return;
					} else {

						sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
							sql.run(`UPDATE scores SET experience = ${row.experience + Math.round(Math.random() * (11 - 4) + 4)} WHERE userId = ${message.author.id}`);
							console.log("Added experience.");
						})

						// Adds the user to the array so that they can't talk for 65 seconds
						talkedRecently.push(message.author.id);
						client.setTimeout(() => {
							const index = talkedRecently.indexOf(message.author.id);
							// Removes the user from the array after 65 seconds
							talkedRecently.splice(index, 1);
						}, 65000);
					}
				}
			}).catch(() => {
				console.error;
				sql.run('CREATE TABLE IF NOT EXISTS scores (userId TEXT, experience INTEGER, level INTEGER)').then(() => {
					sql.run('INSERT INTO scores (userId, experience, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
				});
			});

			var badges = JSON.parse(fs.readFileSync('./badges.json', 'utf8'));

			// If the user currently doesn't exist in the badges file, init to 0 for all badges.
			if (!badges[message.author.id])
				badges[message.author.id] = {
					developer: 0,
					active: 0,
					moderator: 0,
					essaywriter: 0,
					subscriber: 0,
					streamer: 0,
					xbt: 0,
					friendship: 0,
					photographer: 0
				};



			var userBadges = badges[message.author.id];


			sql.get(`SELECT * FROM scores WHERE userId ='${member.id}'`).then(row => {
				// Check if message author is zBlake:
				if (message.author.id == 246574843460321291) {
					userBadges.developer = 1;
				} else {
					userBadges.developer = 0;
				}

				// If message author has a moderator role:
				if (member.roles.find("name", "Fleece Police")) {
					userBadges.moderator = 1;
				} else {
					userBadges.moderator = 0;
				}

				// If message author is one of the names below (active badge):
				if (member.id == 246574843460321291 || member.id == 284551391781978112 || member.id == 184050823326728193 || member.id == 246129294785380353 || member.id == 224472981571633153 || member.id == 213776985581813760 || member.id == 213776985581813760) { // add id's here if active
					userBadges.active = 1;
				} else {
					userBadges.active = 0;
				}

				// If message author has the subscriber role:
				if (member.roles.find("name", "Subscriber")) {
					userBadges.subscriber = 1;
				} else {
					userBadges.subscriber = 0;
				}

				// If message author has the Xail Bot Testing role:
				if (member.roles.find("name", "Xail Bot Testing")) {
					userBadges.xbt = 1;
				} else {
					userBadges.xbt = 0;
				}

				// If message author has 100/100 on the photographer progress badge:
				if (badgecompletion[message.author.id].photographer > 99) {
					userBadges.photographer = 1;
				}

				// If message author is lvl 10 or higher:
				if (`${row.experience} > 2500`) {
					userBadges.essaywriter = 1;
				} else {
					userBadges.essaywriter = 0;
				}

				// If message author is Xailran:
				if (member.id == 196792235654774784) {
					userBadges.streamer = 1;
				} else {
					userBadges.streamer = 0;
				}

				// Save photographer progress if applicable:
				fs.writeFile('./data/badges/badge-progress.json', JSON.stringify(badgecompletion, null, 2), function(err) {
					if (err) {
						console.error(err)
					}
				});

				// Save badges.json
				fs.writeFile('./badges.json', JSON.stringify(badges, null, 2), function(err) {
					if (err) {
						console.error(err)
					}
				});

			})
		})
	})

	// Force Reboot command
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

	// Evaluation command, only works for zBlake:
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

			message.channel.send({
				embed: {
					color: 3191350,
					author: {
						name: "ᴇᴠᴀʟ ʀᴇꜱᴜʟᴛ »  ",
						icon_url: message.author.displayAvatarURL
					},
					fields: [{
							name: '**:inbox_tray: Input**',
							value: `\`\`\`js\n${code}\n\`\`\``
						},
						{
							name: '**:outbox_tray: Output**',
							value: `\`\`\`js\n${clean(evaled)}\n\`\`\``
						}
					],
					timestamp: new Date()
				}
			}).then(m => {
				m.react("✅");
			})
		} catch (err) {
			message.delete();

			message.channel.send({
				embed: {
					color: 3191350,
					author: {
						name: "ᴇᴠᴀʟ ᴇʀʀᴏʀ »  ",
						icon_url: message.author.displayAvatarURL
					},
					fields: [{
							name: '**:no_entry_sign: Error**',
							value: `\`\`\`xl\n${clean(err)}\n\`\`\``
						},
						{
							name: '**Output**',
							value: `\`\`\`js\n${clean(evaled)}\n\`\`\``
						}
					],
					timestamp: new Date()
				}
			}).then(m => {
				m.react("❌");
				m.react(":xailFish:303393341704503297");
			})
		}
	}

	// If botDelMessage has no value, init to true.
	if (botDelMessage == null) {
		botDelMessage = true;
	}

	// If doModeration has no value, init to true.
	if (doModeration.enabled == null || undefined) {
		doModeration.enabled = true;
	}

	// If expletiveFilter has no value, init to true.
	if (expletiveFilter.enabled == null || undefined) {
		expletiveFilter.enabled = true;
	}

	// If botDelMessage is true and an suitable message is found:
	if (botDelMessage) {
		if (message.author.id == 303017211457568778 && doNotDelete == false) {
			console.log(colors.yellow("▲ Bot is about to delete: " + colors.grey(message)));
			message.delete({
				timeout: 10000
			});
		}
	}

	// If panicMode has no value, init to false.
	if (panicMode.enabled == undefined) {
		panicMode.enabled = false;
	}

	// When panic mode is enabled, delete all messages.
	if (panicMode.enabled) {
		message.delete();
	}

	if (message.author.id !== 303017211457568778 && !message.author.bot) {
		if (doModeration.enabled) { //Check if we should do moderation on this server

			// Is the first word in message content found more than [x] times?
			function regexEscape(str) {
				if (str == null)
					return;
				return str.toString().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			}

			function reg(input) {
				var flags;
				//could be any combination of 'g', 'i', and 'm'
				flags = 'gi';

				if (input == null)
					return;
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

			// If a user is spamming the same message multiple times, rate limit.
			if (lastMessages[message.author.id] != msg) {
				sameMessageCount[message.author.id] = 0;
			}

			lastMessages[message.author.id] = msg
			sameMessageCount[message.author.id] += 1;

			if (message.attachments.size > 0) {
				sameMessageCount[message.author.id] = 0;
			}

			if (lastMessages[message.author.id] == msg && sameMessageCount[message.author.id] == 6) {
				var auth = message.author;
				client.channels.get("229575537444651009").send(":warning: **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");
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
				client.channels.get("229575537444651009").send(":warning: **SPAM:** <@" + auth.id + "> was spamming on " + message.channel.name + ".");
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
			
			// Check message content for the words seen in exp or dxp, and if one or more are found, delete the message.
			// Expletive filter
			if (expletiveFilter.enabled) {
				var exp = msg.search(/(\b|\s|^|.|\,|\ )(fuck|fucks|fuckin|fucking|penis|cunt|faggot|fark|fck|fag|wank|wanker|nigger|nigga|bastard|bitch|asshole|dick|dickhead|d1ck|b1tch|b!tch|blowjob|cock|nigg|fuk|cnut|pussy|c0ck|retard|porn|stfu)(\b|\s|$|.|\,|\ )/i);
				var dxp = msg.search(/(\b|\s|^|.|\,|\ )(cunt|b1tch|b!tch|bitch|cnut)(\b|\s|$|.|\,|\ )/i);

				if (exp != -1) { //Gah! They're not supposed to say that!
					if (dxp != -1) { //extra bad word!
						console.log(colors.bold(colors.yellow("▲ Expletive (level 2) caught at " + parseInt(exp))));
						caughtSwear = true;
					}

					console.log(colors.bold(colors.yellow("▲ Expletive caught at " + parseInt(exp))));
					switch (Math.floor(Math.random() * 1000) % 22) {
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
					message.delete();
					return;
				}
			}

			// Special case if message content contains "kill yourself".
			if (message.author.id != 303017211457568778 && msg.search(/\b(kys|kill yourself)\b/i) != -1) {
				var auth = message.author;
				caughtKYS = true;
				message.reply("Right. We don't appreciate that here. A notification has been sent to the mods.");
				message.delete();
			}

			// If the RegEx "exp" executes successfully and finds a match, remove the message.
			// Link filter
			if (message.member != null) { //*!(message.member.roles.find("name", "Fleece Police"))
				//exp = msg.search(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{5,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&// = ]*)/i);
				exp = msg.search(/.*?(http\:\/\/www\.[a-zA-Z0-9\.\/\-]+)/);
				if (exp != -1) { //This is a link.
					if (message.member.roles.find("name", "Fleece Police") || message.member.roles.find("name", "Permitted")) {
					} else if (message.channel.name == "self_promos" || message.channel.name == "music" || message.channel.name == "bot_testin" || message.channel.name == "meme_dungeon" || message.channel.name == "photos" || message.channel.name == "minecraft_ideas") {
					} else if (msg.toLowerCase().includes("twitch.tv/xailran") || msg.toLowerCase().includes("www.youtube.com") || msg.toLowerCase().includes("www.reddit.com") || msg.toLowerCase().includes("discord.gg")) {
					} else {
						caughtLink = true;
						console.log(colors.yellow(colors.bold("Link caught at " + parseInt(exp))));
						message.delete();
						switch (Math.floor(Math.random() * 1000) % 6) {
							case 0:
								message.reply("I've replaced your link with a not-so-link-like link: click here");
								break;
							case 1:
								message.reply("Whatever that link was... I hope it didn't contain some bad stuff...");
								break;
							case 2:
								message.reply("I don't know man, the internet is a dangerous place.");
								break;
							case 3:
								message.reply("Cool. Now let's not forget the rules.");
								break;
							case 4:
								message.reply("If I'm not going to delete it, a mod will. Let's save them some work.");
								break;
							case 5:
								message.reply("We don't want to download your FREE RAM.");
								break;
						}
						return;
					}
				}
			}
		}
	}

	// Start a conversation with the bot.
	if (message.mentions !== null && message.mentions.users !== null) {
		doNotDelete = true;

		// If the message content starts with a mention to Xail Bot, execute conversation code.
		if (msg.toLowerCase().startsWith("<@303017211457568778>")) {
			if (message.channel.name == "bot_testing") {}

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
				message.reply("<:xailFish:303393341704503297>");
			} else if (msg.toLowerCase().includes("how") && msg.toLowerCase().includes("you")) {
				message.reply("I'm doing OK I suppose.");
			} else if (msg.toLowerCase().includes("yes") || msg.toLowerCase().includes("yep") || msg.toLowerCase().includes("right?") || msg.toLowerCase().includes("isn't it?")) {
				message.reply("Well, I suppose so.");
			} else if (msg.toLowerCase().includes("nah") || msg.toLowerCase().includes("nope")) {
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
			} else if (msg.toLowerCase().includes("hello") || msg.toLowerCase().includes("hey") || msg.toLowerCase().includes("howdy") || msg.toLowerCase().endsWith("hi")) {

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
									message.author.send("IMMA FITEACHU LETS GO")
									break;
								case 1:
									message.author.send("you're a derp")
									break;
								case 2:
									message.author.send("https://www.youtube.com/watch?v=4ZaYk7X9KAU\nTHE MUUUSIICCC <3 <3 <3")
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
			} else if (msg.toLowerCase().includes("boy i sure do wish i could give money to dude, he is just such a smart, funny guy that i want to give the guy funds to help the channel.")) {
				message.reply("That is a very specific request you have there!");
			} else if (msg.toLowerCase().includes("+") || msg.toLowerCase().includes("divided") || msg.toLowerCase().includes("-") || msg.toLowerCase().includes("plus") || msg.toLowerCase().includes("subtract") || msg.toLowerCase().includes("minus") || msg.toLowerCase().includes("times") || msg.toLowerCase().includes("*") || msg.toLowerCase().includes("/") || msg.toLowerCase().includes("=")) {
				message.reply("Sorry, I don't know what it is. Go ask Xail, he'd probably know.");
			} else if (msg.toLowerCase().includes("shut down") || msg.toLowerCase().includes("shut off") || msg.toLowerCase().includes("turn off") || msg.toLowerCase().includes("go away") || msg.toLowerCase().includes("shutdown")) {
				message.reply(":white_check_mark: XailBot is now exiting. Goodbye!");
				message.reply("Haha, just kidding.");
			} else if (msg.toLowerCase().includes("but first")) {
				message.reply("We need to talk about parallel universes.");
			}
		}
	}

	// Command handler for bot, mod and debug commands.
	if (msg.toLowerCase().startsWith("+")) {

		//Un-comment to activate Lockdown Mode. 	return message.channel.send(":no_entry_sign: **EMERGENCY**: *Xail Bot* has temporarily been placed in **LOCKDOWN MODE**. Learn more about why this has happened here: https://github.com/zBlakee/Xail-Bot/wiki/Lockdown-Mode");
		var command = msg.substr(1).split(" ").slice(0, 1);
		var args = msg.split(" ").slice(1);

		exports.commandIssuer = message.author.id;
		console.log(colors.bold(colors.bgBlue(colors.white(message.author.username + " issued command " + command))));

		try {
			let commandFile = require(`./commands/${command}.js`);
			if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
				message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
		} else if (!message.member.roles.find("name", "Fleece Police")) {
			if (command == "mod" || command == "filter" || command == "rm" || command == "uinfo" || command == "warn" || command == "ban" || command == "softban" || command == "mute" || command == "say" || command == "permit" || command == "setgame" || command == "reboot" || command == "cancel") {
			message.reply(':no_entry_sign: **NOPE:** What? You\'re not a moderator! Why would you be allowed to type that!?');
			}	
		} else {
			commandFile.run(client, message, args);
			}
		} catch (err) {
			if (command.toString().toLowerCase().includes(".") || command.toString().toLowerCase().includes("/") || command.toString().toLowerCase().includes("moderator") || command.toString().toLowerCase().includes("debug")) {
				message.reply(":no_entry_sign: **NICE TRY**: Don't even try that buddy.");
			}
				message.reply(":no_entry_sign: **NOPE**: That is not a valid command. You can type `bot:help` to see a list of all available commands.");
				console.error(colors.bold(colors.bgRed(colors.white(err))));
				console.error(colors.bold(colors.bgYellow(colors.white("This was most likely caused by the user not entering a valid command."))));

			}
	}
	
	// Debug command handler
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

	// If a command is deprecated, handle command using disabled:
	if (msg.toLowerCase().startsWith("disabled:")) {
		if (message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Head of the Flock")) {
			var command = msg.substr(9).split(" ").slice(0, 1);
			var args = msg.split(" ").slice(1);

			console.log(colors.bold(colors.bgBlue(colors.red(message.author.username + " issued disabled command " + command))));

			try {
				let commandFile = require(`./commands/disabled/${command}.js`);
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

	// Special case for xbt: commands.
	if (msg.toLowerCase().startsWith("xbt:")) {
		if (message.member.roles.find("name", "Xail Bot Testing") || message.member.roles.find("name", "Admin")) {
			var command = msg.substr(4).split(" ").slice(0, 1);
			var args = msg.split(" ").slice(1);

			console.log(colors.bold(colors.bgBlue(colors.green(message.author.username + " issued XBT command " + command))));

			try {
				let commandFile = require(`./commands/xbt/${command}.js`);
				commandFile.run(client, message, args);
			} catch (err) {
				console.error(colors.bold(colors.bgRed(colors.white(err))));
				console.error(colors.bold(colors.bgYellow(colors.white("This was most likely caused by the user not entering a valid command."))));
			}
		} else {
			doNotDelete = false;
			message.reply(':no_entry_sign: **NOPE:** You need to be apart of Xail Bot Testing to use this command.');
			message.delete();
		}
	}
}

// END OF MESSAGE Function

client.on('message', messageChecker);
client.on('messageUpdate', messageChecker);

client.on('guildMemberAdd', function(guildMember) {
	if (guildMember.guild.id == 196793479899250688) {
		guildMember.addRole(guildMember.guild.roles.get("224372132019306496"));

		channel = client.channels.get("196793479899250688");
		let randomjoin = "";
		switch (Math.floor(Math.random() * 1000) % 7) {
			case 0:
				randomjoin = "Please give them a warm welcome!";
				break;
			case 1:
				randomjoin = "Thank you for joining, and we hope you enjoy your stay!";
				break;
			case 2:
				randomjoin = "Thanks for joining us!";
				break;
			case 3:
				randomjoin = "It's great to have you here!";
				break;
			case 4:
				randomjoin = "It's a pleasure to have you here.";
				break;
			case 5:
				randomjoin = "Hope you have had a great day so far!";
				break;
			case 6:
				randomjoin = "Nice to see you!";
				break;
		}
		channel.send(guildMember + " has joined our awesome server! *" + randomjoin + "*")

		channel = client.channels.get("229575537444651009");
		channel.send({
			embed: {
				color: 3191350,
				author: {
					name: "ᴜꜱᴇʀ ᴊᴏɪɴᴇᴅ »  " + guildMember.user.tag,
					icon_url: guildMember.user.displayAvatarURL
				},
				fields: [{
						name: '**Discriminator**',
						value: "#" + guildMember.user.discriminator
					},
					{
						name: '**User Created**',
						value: guildMember.user.createdAt.toDateString() + " at " + guildMember.user.createdAt.toLocaleTimeString()
					},
					{
						name: '**User Joined**',
						value: guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString()
					}
				],
				timestamp: new Date()
			}
		});

	}
});

client.on('guildMemberRemove', function(guildMember) {
	if (guildMember.guild.id == 196793479899250688) {
		channel = client.channels.get("229575537444651009");
		channel.send({
			embed: {
				color: 13724718,
				author: {
					name: "ᴜꜱᴇʀ ʀᴇᴍᴏᴠᴇᴅ »  " + guildMember.user.tag,
					icon_url: guildMember.user.displayAvatarURL
				},
				fields: [{
						name: '**Username**',
						value: guildMember.user.tag
					},
					{
						name: '**User Joined**',
						value: guildMember.joinedAt.toDateString() + " at " + guildMember.joinedAt.toLocaleTimeString()
					}
				],
				timestamp: new Date()
			}
		});

	}
});

client.on('guildMemberUpdate', function(oldUser, newUser) {
	if (oldUser.user.bot == true)
		return;

	if (newUser.nickname != oldUser.nickname) {
		var channel = client.channels.get("229575537444651009"); //Admin Bot warnings
		if (newUser.nickname == null) {
			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 4371444,
					author: {
						name: "ɴɪᴄᴋɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.tag,
						icon_url: oldUser.user.displayAvatarURL
					},
					description: ":label: <@" + oldUser.user.id + "> has cleared their nickname.\nIt has now defaulted back to their username.\n",
					fields: [{
						name: '**Previous Nickname**',
						value: oldUser.displayName
					}],
					timestamp: new Date()
				}
			});
			return;
		} else {
			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 4371444,
					author: {
						name: "ɴɪᴄᴋɴᴀᴍᴇ ᴄʜᴀɴɢᴇ »  " + oldUser.user.tag,
						icon_url: oldUser.user.avatarURL({
							format: 'png'
						})
					},
					description: ":label: <@" + oldUser.user.id + "> has changed their nickname.\n",
					fields: [{
							name: '**Previous Nickname**',
							value: oldUser.displayName
						},
						{
							name: '**New Nickname**',
							value: newUser.displayName
						}
					],
					timestamp: new Date()
				}
			});
			return;
		}
	}
});

client.on('userUpdate', function(oldUser, newUser) {});

client.on('messageDelete', function(message) {
	if (message.content.startsWith("bot:") || message.content.startsWith("mod:"))
		return;
	var channel = null;

	if (message.guild != null) {

		if (message.guild.id == 196793479899250688) { //General chat for testbot
			channel = client.channels.get("229575537444651009");
		}

		if (panicMode[message.guild.id])
			return; //Don't want to be doing this in panic mode!
		if (message.author.id == 303017211457568778)
			return;
		if (message.author.id == 155149108183695360)
			return; //Dyno
		if (message.author.id == 184405311681986560)
			return; //FredBoat
		if (ignoreMessage) {
			ignoreMessage = false;
			return;
		}

		if (caughtKYS == true) {
			caughtKYS = false;

			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 14714691,
					author: {
						name: "ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag,
						icon_url: message.member.user.displayAvatarURL
					},
					description: ":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n",
					fields: [{
							name: '**Message**',
							value: message.cleanContent
						},
						{
							name: '**Reason**',
							value: "Death threat contained in message.\n"
						}
					],
					timestamp: new Date()
				}
			});
			return;
		} else if (caughtSpam == true) {
			caughtSpam = false;

			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 14714691,
					author: {
						name: "ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag,
						icon_url: message.member.user.displayAvatarURL
					},
					description: ":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n",
					fields: [{
							name: '**Message**',
							value: message.cleanContent
						},
						{
							name: '**Reason**',
							value: "Duplicated words/letters.\n"
						}
					],
					timestamp: new Date()
				}
			});
			return;
		} else if (caughtSwear == true) {
			caughtSwear = false;

			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 14714691,
					author: {
						name: "ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag,
						icon_url: message.member.user.displayAvatarURL
					},
					description: ":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n",
					fields: [{
							name: '**Message**',
							value: message.cleanContent
						},
						{
							name: '**Reason**',
							value: "Expletives found in message.\n"
						}
					],
					timestamp: new Date()
				}
			});
			return;
		} else if (caughtLink == true) {
			caughtLink = false;

			channel = client.channels.get("229575537444651009");
			channel.send({
				embed: {
					color: 14714691,
					author: {
						name: "ᴍᴇꜱꜱᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ »  " + message.author.tag,
						icon_url: message.member.user.displayAvatarURL
					},
					description: ":wastebasket: Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n",
					fields: [{
							name: '**Message**',
							value: message.cleanContent
						},
						{
							name: '**Reason**',
							value: "Unconfirmed link contained in message.\n"
						}
					],
					timestamp: new Date()
				}
			});
			return;
		}
	}
});

client.on('messageDeleteBulk', function(messages) {
	var channel = null;

	if (panicMode[messages.first().guild.id])
		return; //Don't want to be doing this in panic mode!
	if (botDelMessage[messages.first().guild.id])
		return;

	bulkC = bulkC + 1

	//Debugging information.
	//if (maintenance == true) {
	channel = client.channels.get("325540027972976650");
	channel.send(":page_facing_up: **DEBUG:** BulkDelete function, called " + bulkC + " times. Deleted " + messages.size + " messages.");
	//}

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
			channel = client.channels.get("229575537444651009");
		}

		if (channel != null) {
			if (oldMessage.author.bot) return;
			if (oldMessage.member.roles.find("name", "Fleece Police") || oldMessage.member.roles.find("name", "Head of the Flock")) {
				return;
			} else {
				channel = client.channels.get("229575537444651009");
				channel.send({
					embed: {
						color: 16040514,
						author: {
							name: "ᴍᴇꜱꜱᴀɢᴇ ᴇᴅɪᴛᴇᴅ »  " + oldMessage.author.tag,
							icon_url: oldMessage.author.displayAvatarURL
						},
						description: ":pencil: Message by <@" + oldMessage.author.id + "> in <#" + oldMessage.channel.id + "> was edited.\n",
						fields: [{
								name: '**Old Content**',
								value: oldMessage.cleanContent
							},
							{
								name: '**New Content**',
								value: newMessage.cleanContent
							}
						],
						timestamp: new Date()
					}
				});
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