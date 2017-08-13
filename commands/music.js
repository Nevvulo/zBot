const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const yt = require('ytdl-core');
const bot = require('./../bot.js');
const maintenance = require('./debug/maintenance.js');
var colors = require('colors');

var queue = {};
var music = {};
var skipCount = 3;
var currentSong = null;
var usersVotedSkip = [];
var queueList = "";
var songRepeat = false;
var musicEnd = false;
var debug = false;
exports.run = (client, message, args) => {
	if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
if (maintenance.maintenanceEnabled == true) {
		debug = true;
	} else {
		debug = false;
	}

	args = args.toString();
	music = args.split(" ").toString();
	//Debugging information.
	if (debug == true) {
		message.channel.send(":page_facing_up: **DEBUG:** User *" + message.author + "* entered arguments " + music);
		message.channel.send(":page_facing_up: **DEBUG:** The queue is currently ```" + queue + "```, and has " + queue.length + " songs.");
	}

	const voiceChannel = message.member.voiceChannel;

	if (!voiceChannel) {
		//Debugging information.
		if (debug == true) {
			message.channel.send(":page_facing_up: **DEBUG:** User *" + message.author + "* wasn't found in a voice channel.");
		}

		bot.doNotDelete = false;
		message.reply(":no_entry_sign: **ERROR:** You aren't currently in a voice channel.");
		message.delete ();
		return;
	}
	voiceChannel.join()
	.then(connection => {
		if (music == "skip") {
			if (queue == "") {
				message.reply(":no_entry_sign: **ERROR:** There are no more songs in the queue left to skip.");
				return;
			}

			if (voiceChannel.members.size < 3 || skipCount < 2) {
				if (usersVotedSkip.includes(message.author.id)) {
					bot.doNotDelete = false;
					message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
					return;
				}
				usersVotedSkip = [];
				skipCount = 3
					yt.getInfo(currentSong, function (err, info) {
						message.channel.send(":white_check_mark: **OK:** " + message.author + " skipped **" + info.title + "**.").then(() => {
							dispatcher.end();
						});
					});
				return;
			} else {
				if (skipCount == 3) {

					if (usersVotedSkip.includes(message.author.id)) {
						message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
						return;
					}
					usersVotedSkip.push(message.author.id);
					skipCount = skipCount - 1
						message.channel.send(":white_check_mark: **OK:** " + message.author + " has started a vote to skip the current song. **" + skipCount + "** more votes are required in order to skip.")
						return;
				} else {

					if (usersVotedSkip.includes(message.author.id)) {
						message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
						return;
					}
					usersVotedSkip.push(message.author.id);
					skipCount = skipCount - 1
						message.channel.send(":white_check_mark: **OK:** " + message.author + " has voted to skip the current song. **" + skipCount + "** more votes are required in order to skip.")
						return;
				}
				return;
			}
			return;

		} else if (music == "queue") {
			if (queue[message.guild.id] === undefined) return message.channel.send(":no_entry_sign: **ERROR:** There are no songs currently in the queue.");
					let tosend = [];
					queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
					message.channel.send(`__**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
		} else if (music == "next") {
			if (queue == "") {
				//Debugging information.
				if (debug == true) {
					message.channel.send(":page_facing_up: **DEBUG:** __queue__ is " + queue + ".");
				}
				message.channel.send(":no_entry_sign: **ERROR:** There are no songs that are next.");
				return;
			}
			yt.getInfo(queue[0], function (err, info) {
				message.channel.send(":fast_forward: **NEXT SONG:** " + info.title);
				message.delete ();
			});
			return;
		} else if (music == "repeat") {
			if (songRepeat == true) {
				songRepeat = false;
				message.channel.send(":repeat_one: Repeat is now turned off.");
			} else {
				yt.getInfo(currentSong, function (err, info) {
					message.channel.send(":repeat_one: **" + info.title + "** is now on repeat. Type `+music repeat` again to toggle off.");
					message.delete ();
					songRepeat = true;
				});
			}
			return;
		} else if (music == "end") {
			if (voiceChannel.members.size < 3 || message.member.roles.find("name", "Fleece Police")) {
				//Debugging information.
				if (debug == true) {
					message.channel.send(":page_facing_up: **DEBUG:** " + message.author + " cleared the queue.");
				}

				queue[message.guild.id] = [];
				musicEnd = true;
				voiceChannel.leave();
				message.channel.send(":mute: The queue was cleared by **" + message.author + "**.");
				return;
			} else {
				//Debugging information.
				if (debug == true) {
					message.channel.send(":page_facing_up: **DEBUG:** " + message.author + " is in " + voiceChannel.name + ", which currently has " + voiceChannel.members.size + " members in it. They are not permitted to clear the queue.");
				}

				message.reply(":no_entry_sign: **NOPE:** You can't do that, there are other people in this channel listening to the music!");
				return;
			}
		}


		if (music !== "skip" && music !== "queue" && music !== "next" && music !== "repeat" && music !== "end") {
			yt.getInfo(music, (err, info) => {
			if (queue[message.guild.id].playing || queue[message.guild.id].songs.length > 0) {
			console.log(colors.bgYellow("▲ There is a song already playing."));
					if(err) return message.channel.send('Invalid YouTube Link: ' + err);
					if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
					queue[message.guild.id].songs.push({url: music, title: info.title, requester: message.author.username});
					message.channel.send(":white_check_mark: **OK:** I've added **" + info.title + "** into the queue.");
			return;
		} else {
			var firstTime = {url: music, title: info.title, requester: message.author.username};
			console.log(queue)
			queueMusic(firstTime);
		}
			});
		}


		function queueMusic(song) {
			console.log("song = " + song)
			//Debugging information.
			if (debug == true) {
				message.channel.send(":page_facing_up: **DEBUG:** In function __queueMusic__, checking for commands...");
			}

			yt.getInfo(music, function (err, info) {
				if (err) {
					message.reply(":no_entry_sign: **ERROR:** I couldn't find the video that you specified.");
					queue[message.guild.id].songs.shift();
					return;
				}
			});

			if (music !== "skip" && music !== "queue" && music !== "next" && music !== "repeat" && music !== "end") {
				//Debugging information.
				if (debug == true) {
					message.channel.send(":page_facing_up: **DEBUG:** __music__ is not equal to any of the available commands, setting __currentSong__ to __queue__.");
				}
				if (songRepeat == true) {
					currentSong = currentSong;
				} else {
					currentSong = song.url;
				}
			}

			if (bot.npEnabled == true) {
					console.log("Now playing " + song.url)
					message.channel.send(":headphones: **NOW PLAYING:** " + song.title);
			}

			queue[message.guild.id].playing = true;

			const streamOptions = {
				seek: 0,
				volume: 0.7
			};
			const streamfunc = yt(currentSong, {
					filter: 'audioonly'
				});

			dispatcher = message.guild.voiceConnection.playStream(streamfunc, streamOptions);

			if (songRepeat == false) {
				//Debugging information.
				if (debug == true) {
					message.channel.send(":page_facing_up: **DEBUG:** Repeat is off, shifting to next song.");
				}
				queue[message.guild.id].songs.shift();
			}

			dispatcher.on('end', () => {
				if (queue == "" && songRepeat == false) {
					//Debugging information.
					if (debug == true) {
						message.channel.send(":page_facing_up: **DEBUG:** Queue is empty and repeat is off.");
					}
					musicEnd = true;
				}

				if (musicEnd !== true) {
					//Debugging information.
					if (debug == true) {
						message.channel.send(":page_facing_up: **DEBUG:** Playing the next song in the queue, " + queue[0] + ".");
					}
					queueMusic(queue[message.guild.id].songs.shift());
				} else {
					musicEnd = false;
					console.log("Music ended.");
					message.channel.send(":mute: The queue is empty.");
					queue[message.guild.id].playing = false;
				}
			});
		}

	});
	message.delete ();
	return;
}
