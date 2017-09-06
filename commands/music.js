const Discord = require('discord.js');
const client = new Discord.Client();
const yt = require('ytdl-core');
const api = require('./../data/main/keys/keys.js');
const YouTube = require('simple-youtube-api');
var youtube = new YouTube(api.youtube());
const Settings = require('./../structures/general/Settings.js');
var colors = require('colors');

var queue = {};
var skipCount = 3;
var currentSong = null;
var usersVotedSkip = [];
var queueList = "";
var songRepeat = false;
var musicEnd = false;
var debug = true;
var firstSong = true;

exports.run = async (client, message, args) => {

client.users.fetch("287377351845609493", true)
var musicAccount = client.users.fetch('287377351845609493').then(user => musicAccount = user.avatarURL( {format: 'png'} ))
	if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
	const searchString = args.slice(0).join(' ');
	const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	const voiceChannel = message.member.voiceChannel;

	if (!voiceChannel) {
		message.reply(":no_entry_sign: **ERROR:** You aren't currently in a voice channel.");
		message.delete();
		return;
	}

	voiceChannel.join()
	.then(connection => {
		if (url == "skip") {
			if (queue == "") {
				message.reply(":no_entry_sign: **ERROR:** There are no more songs in the queue left to skip.");
				return;
			}

			if (voiceChannel.members.size < 3 || message.member.roles.has(Settings.getValue(message.guild, "moderatorRole")) || skipCount < 2) {
				if (usersVotedSkip.includes(message.author.id)) {
					message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
					return;
				}
				usersVotedSkip = [];
				skipCount = 3
					yt.getInfo(currentSong, function (err, info) {
						message.channel.send(":white_check_mark: **OK:** " + message.author + " skipped **" + info.title + "**.").then(() => {
							message.guild.voiceConnection.dispatcher.end("Skip")
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
						message.channel.send(":white_check_mark: **OK:** " + message.member.displayName + " has voted to skip the current song. **" + skipCount + "** more votes are required in order to skip.")
						return;
				}
				return;
			}
			return;

		} else if (url == "queue") {
			if (queue[message.guild.id] === undefined) return message.channel.send(":no_entry_sign: **ERROR:** There are no songs currently in the queue.");
					let tosend = [];
					queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. **${song.title}**  ■  *Requested by ${song.requester}*`);});
					const embed = new Discord.MessageEmbed()
						if (tosend == [] || tosend.length < 1) {
						embed.addField("Queued Songs", "There are no songs in the queue.")
					} else {
						embed.addField("Queued Songs", tosend.slice(0,5).join('\n'))
					}
						embed.setColor("#b3cc39")
						embed.setFooter('zBot Music Player - ' + queue[message.guild.id].songs.length + ' songs queued', musicAccount)
					message.channel.send({ embed })
		} else if (url == "next") {
			if (queue[message.guild.id].songs.length < 1) {
				message.channel.send(":no_entry_sign: **ERROR:** There are no songs that are next.");
				return;
			}
				message.channel.send(":fast_forward: **NEXT SONG:** " + queue[message.guild.id].songs[0].title);
				message.delete();
			return;
		} else if (url == "repeat") {
			if (songRepeat == true) {
				songRepeat = false;
				message.channel.send(":repeat_one: Repeat is now turned off.");
			} else {
				yt.getInfo(currentSong, function (err, info) {
					message.channel.send(":repeat_one: **" + info.title + "** is now on repeat. Type `" + Settings.getValue(message.guild, "prefix") + "music repeat` again to toggle off.");
					message.delete ();
					songRepeat = true;
				});
			}
			return;
		} else if (url == "end") {
			if (voiceChannel.members.size < 3 || message.member.roles.has(Settings.getValue(message.guild, "moderatorRole"))) {
				queue[message.guild.id].songs = [];
				musicEnd = true;
				message.guild.voiceConnection.dispatcher.end("End")
				voiceChannel.leave();
				firstSong = true;
				message.channel.send(":mute: The queue was cleared by **" + message.author + "**.");
				return;
			} else {
				message.reply(":no_entry_sign: **NOPE:** You can't do that, there are other people in this channel listening to the music!");
				return;
			}
		}
		results()
		async function results() {
		if (url !== "skip" && url !== "queue" && url !== "next" && url !== "repeat" && url !== "end") {
			try {
				//First check to see if arguments are a URL
				var video = await youtube.getVideo(url);
			} catch (error) {
			try {
				//If not a URL, perform search
				var videos = await youtube.searchVideos(searchString, 1);
				var video = await youtube.getVideoByID(videos[0].id);
			} catch (err) {
				try {
					//If search fails, check for a playlist
					var playlist = await youtube.getPlaylist(url);
					var video = await playlist.getVideos()

					let song = {url: `https://www.youtube.com/watch?v=${video[0].id}`, title: video[0].title, requester: message.author.username}
					queueMusic(song)

					for (let i=1; i < video.length; i++) {
						if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
						queue[message.guild.id].songs.push({url: `https://www.youtube.com/watch?v=${video[i].id}`, title: video[i].title, requester: message.author.username});
					}
					const embed = new Discord.MessageEmbed()
						.setAuthor('Music Added » ' + message.author.tag, message.author.avatarURL( {format: 'png'} ))
						.setDescription(":white_check_mark: **OK:** I've added the playlist **" + playlist.title + "** into the queue.")
						.setColor("#b3cc39")
						.setFooter('zBot Music Player - ' + queue[message.guild.id].songs.length + ' songs queued', musicAccount)
					message.channel.send({ embed })
					return;
				} catch (err) {
					//If all else fails, throw an error.
					log(err, logType.critical)
					return message.reply(":no_entry_sign: **ERROR**: I couldn't obtain any search results.");
				}
			}
			}

			if (firstSong) {
				firstSong = false;
				let song = {url: `https://www.youtube.com/watch?v=${video.id}`, title: video.title, requester: message.author.username}
				queueMusic(song)
				return;
			}

			if (queue[message.guild.id].playing || queue[message.guild.id].songs.length > 0) {
					if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
					queue[message.guild.id].songs.push({url: `https://www.youtube.com/watch?v=${video.id}`, title: video.title, requester: message.author.username});
					const embed = new Discord.MessageEmbed()
						.setAuthor('Music Added » ' + message.author.tag, message.author.avatarURL( {format: 'png'} ))
						.setDescription(":white_check_mark: **OK:** I've added **" + video.title + "** into the queue.")
						.setColor("#b3cc39")
						.setFooter('zBot Music Player - ' + queue[message.guild.id].songs.length + ' songs queued', musicAccount)
					message.channel.send({ embed })
			return;
			}
		}
	}
	})

		function queueMusic(song) {
			queue[message.guild.id].playing = true;
			log("Playing song " + song.title + " in " + message.guild.name + ".", logType.info)

				if (songRepeat == true) {
					currentSong = currentSong;
				} else {
					currentSong = song.url;
				}

			if (Settings.getValue(message.guild, "musicNPModule") == true) {
				const embed = new Discord.MessageEmbed()
					.addField('Music Playing', ":headphones: **" + song.title + "** is now playing.", true)
					.setColor("#39cc45")
					.setFooter('zBot Music Player - ' + queue[message.guild.id].songs.length + ' songs queued', musicAccount)
				message.channel.send({ embed })
			}

			const streamOptions = {
				seek: 0,
				volume: 0.7
			};
			const streamfunc = yt(song.url, {
					filter: 'audioonly'
				});

			const dispatcher = message.guild.voiceConnection.playStream(streamfunc, streamOptions);

			dispatcher.on('end', () => {
					if (songRepeat == true) {
						var nextSong = queue[message.guild.id].songs[0];
						queueMusic(nextSong);
						return;
						}
					var nextSong = queue[message.guild.id].songs.shift();
					if (nextSong == undefined) {
						log("Music ended in " + message.guild.name + ".", logType.info);
						message.channel.send(":mute: The queue is empty.");
						queue[message.guild.id].playing = false;
						firstSong = true
						dispatcher.end();
						voiceChannel.leave();
						return;
					}
					queueMusic(nextSong);
			});
		}

	message.delete ();
	return;
}


let command = 'music'
, description = 'Music player that can play YouTube videos.'
, usage = 'music **[link]** (queue|skip|next|repeat|end)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
