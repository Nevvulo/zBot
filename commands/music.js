const Discord = require('discord.js');
const client = new Discord.Client();
const yt = require('ytdl-core');
const api = require('./../data/main/keys/keys.js');
const YouTube = require('simple-youtube-api');
var youtube = new YouTube(api.youtube());
const Settings = require('./../structures/general/Settings.js');
const moment = require('moment');
var colors = require('colors');

var queue = {};
var currentSong = null;
var usersVotedSkip = {};
var queueList = "";
var songRepeat = false;
var musicEnd = false;
var debug = true;
var firstSong = true;

exports.run = async (client, message, args) => {
message.delete();
client.users.fetch("287377351845609493", true)
var musicAccount = client.users.fetch('287377351845609493').then(user => musicAccount = user.displayAvatarURL())
	const searchString = args.slice(0).join(' ');
	const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
	const voiceChannel = message.member.voiceChannel;
	const moderatorRole = await Settings.getValue(message.guild, "moderatorRole");
	const prefix = await Settings.getValue(message.guild, "prefix");
	if (url == "" && searchString == "") return message.reply(":no_entry_sign: **ERROR**: You need to provide a video to play, or use one of the sub-commands. " + 'See `' + prefix + 'help music` for more information.')
	if (!voiceChannel) return message.reply(":no_entry_sign: **ERROR:** You aren't currently in a voice channel.");

	voiceChannel.join()
	.then(connection => {
		if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [], queue[message.guild.id].currentSong = null, queue[message.guild.id].connection = connection, queue[message.guild.id].repeat = false;
		if (!usersVotedSkip.hasOwnProperty(message.guild.id)) usersVotedSkip[message.guild.id] = {}, usersVotedSkip[message.guild.id].members = [], usersVotedSkip[message.guild.id].count = 3;
		if (voiceChannel.speakable == false) return message.reply(":no_entry_sign: **ERROR**: I don't have permission to play audio in that channel.")

		if (url == "skip") {
			if (queue == {}) return message.reply(":no_entry_sign: **ERROR:** There are no more songs in the queue left to skip.");
			var memberCountnb = voiceChannel.members.filter(a => !a.user.bot).array().length;
			if (memberCountnb < 3 || message.member.roles.has(moderatorRole) || usersVotedSkip[message.guild.id].count < 2) {
				if (usersVotedSkip[message.guild.id].members.includes(message.author.id)) {
					message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
					return;
				}
				usersVotedSkip[message.guild.id].count = 3;
					yt.getInfo(queue[message.guild.id].currentSong.url, function (err, info) {
						message.channel.send(":white_check_mark: **OK:** " + message.author + " skipped **" + info.title + "**.")
							queue[message.guild.id].connection.dispatcher.end();
							usersVotedSkip[message.guild.id].members = [];
					});
				return;
			} else {
				if (usersVotedSkip[message.guild.id].count == 3) {
					if (usersVotedSkip[message.guild.id].members.includes(message.author.id)) {
						message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
						return;
					}
					usersVotedSkip[message.guild.id].members.push(message.author.id);
					usersVotedSkip[message.guild.id].count -= 1
						message.channel.send(":white_check_mark: **OK:** " + message.author + " has started a vote to skip the current song. **" + usersVotedSkip[message.guild.id].count + "** more votes are required in order to skip.")
						return;
				} else {
					if (usersVotedSkip[message.guild.id].members.includes(message.author.id)) {
						message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
						return;
					}
					usersVotedSkip[message.guild.id].members.push(message.author.id);
					usersVotedSkip[message.guild.id].count -= 1
						message.channel.send(":white_check_mark: **OK:** " + message.member.displayName + " has voted to skip the current song. **" + usersVotedSkip[message.guild.id].count + "** more votes are required in order to skip.")
						return;
				}
				return;
			}
			return;

		} else if (url == "queue") {
				let tosend = [];
					queue[message.guild.id].songs.forEach((song, i) => {
						let d = moment.duration({s: song.duration});
						tosend.push(`${i+1}. **${song.title}** (${moment().startOf('day').add(d).format('HH:mm:ss')})`);
					});
					const embed = new Discord.MessageEmbed()
						if (tosend == [] || tosend.length < 1) {
						embed.addField("Queued Songs", "There are no songs in the queue.")
					} else {
						embed.addField("Queued Songs", tosend.slice(0,5).join('\n'))
					}
						embed.setColor("#ffee58")
						embed.setFooter('zBot Music Player - ' + queue[message.guild.id].songs.length + ' songs queued',  client.user.avatarURL( {format: 'png'} ))
					message.channel.send({ embed })
		} else if (url == "next") {
			if (queue[message.guild.id].songs.length < 1) return message.reply(":no_entry_sign: **ERROR:** There are no songs that are next.");
				return message.channel.send(":fast_forward: **NEXT SONG:** " + queue[message.guild.id].songs[0].title);
		} else if (url == "repeat") {
			if (queue[message.guild.id].repeat == true) {
				queue[message.guild.id].repeat = false;
				message.channel.send(":repeat_one: Repeat is now turned off.");
			} else {
				yt.getInfo(queue[message.guild.id].currentSong.url, function (err, info) {
					message.channel.send(":repeat_one: **" + info.title + "** is now on repeat. Type `" +  + "music repeat` again to toggle off.");
					queue[message.guild.id].repeat = true;
				});
			}
			return;
		} else if (url == "pause") {
			message.channel.send(":white_check_mark: **OK**: Audio playback was **paused** by **" + message.author + "**.");
			queue[message.guild.id].connection.dispatcher.pause();
			return;
		} else if (url == "play") {
			message.channel.send(":white_check_mark: **OK**: Audio playback was **resumed** by **" + message.author + "**.");
			queue[message.guild.id].connection.dispatcher.resume();
			return;
		} else if (url == "end") {
			var memberCountnb = voiceChannel.members.filter(a => !a.user.bot).array().length;
			if (memberCountnb < 2 || message.member.roles.has(moderatorRole)) {
				queue[message.guild.id].songs = [];
				musicEnd = true;
				usersVotedSkip[message.guild.id].members = [];
				queue[message.guild.id].connection.dispatcher.end("End");
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


					for (let i=0; i < video.length; i++) {
						let videoDuration = await youtube.getVideoByID(video[i].id);
						let duration = videoDuration.durationSeconds;
						if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].currentSong = null, queue[message.guild.id].songs = [], queue[message.guild.id].connection = connection, queue[message.guild.id].repeat = false;
						queue[message.guild.id].songs.push({url: `https://www.youtube.com/watch?v=${video[i].id}`, title: video[i].title, requester: message.author.username, duration: duration});
					}

					const embed = new Discord.MessageEmbed()
						.setAuthor('Music Added » ' + message.author.tag, message.author.avatarURL( {format: 'png'} ))
						.setDescription(":white_check_mark: **OK:** I've added the playlist **" + playlist.title + "** into the queue.")
						.setColor("#d4e157")
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

			if (queue[message.guild.id].playing) {
					if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [], queue[message.guild.id].currentSong = null, queue[message.guild.id].connection = connection, queue[message.guild.id].repeat = false;
					queue[message.guild.id].songs.push({url: `https://www.youtube.com/watch?v=${video.id}`, title: video.title, requester: message.author.username, duration: video.durationSeconds});
					let d = moment.duration({s: video.durationSeconds});
					const embed = new Discord.MessageEmbed()
						.setAuthor('Music Added » ' + message.author.tag, message.author.avatarURL( {format: 'png'} ))
						.setDescription(`:white_check_mark: **OK:** I've added **${video.title}** into the queue. (${moment().startOf('day').add(d).format('HH:mm:ss')})`)
						.setColor("#d4e157")
						.setFooter('zBot Music Player - ' + queue[message.guild.id].songs.length + ' songs queued', musicAccount)
					message.channel.send({ embed })
			return;
		} else {
			let song = {url: `https://www.youtube.com/watch?v=${video.id}`, title: video.title, requester: message.author.username, duration: video.durationSeconds}
			return queueMusic(song)
		}
		}
	}
	})

		async function queueMusic(song) {
			queue[message.guild.id].currentSong = song;

			 	if (eval(song.url === undefined)) {
				message.reply(":no_entry_sign: **ERROR**: I couldn't play that video. This may be because the video is blocked in **Australia** (where zBot is hosted), or because the video is private. Try again with a different video.");
				queue[message.guild.id].connection.dispatcher.end();
				throw err;
			}
			queue[message.guild.id].playing = true;
			log("Playing song " + song.title + " in " + message.guild.name + ".", logType.info)



			if (await Settings.getValue(message.guild, "musicNPModule") == true) {
				let d = moment.duration({s: song.duration});
				const embed = new Discord.MessageEmbed()
					.addField('Music Playing', `:headphones: **${song.title}** is now playing. (${moment().startOf('day').add(d).format('HH:mm:ss')})`, true)
					.setColor("#9ccc65")
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

			let dispatcher = queue[message.guild.id].connection.playStream(streamfunc, streamOptions);

			dispatcher.on('end', (reason) => {
				if (queue[message.guild.id].repeat == true) {
					var nextSong = queue[message.guild.id].currentSong;
					if (nextSong == undefined) {
						return endMusic();
					}
					return queueMusic(nextSong);
					}

				function endMusic() {
					log("Music ended in " + message.guild.name + ".", logType.info);
					message.channel.send(":mute: The queue is empty.");
					queue[message.guild.id].playing = false;
					delete queue[message.guild.id]
					voiceChannel.leave();
					return;
				}

				if (reason === "End") {
					return endMusic();
				}

					if (queue[message.guild.id].songs < 1) return endMusic();
					var nextSong = queue[message.guild.id].songs.shift();
					if (nextSong == undefined) {
						return endMusic();
					}
					return queueMusic(nextSong);
			});
		}

}


let command = 'music'
, description = 'Music player that can play YouTube videos.'
, usage = 'music **[search query or link]** (queue | skip | next | repeat | end)'
, throttle = {usages: 3, duration: 10};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
