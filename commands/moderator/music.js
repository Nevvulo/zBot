const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const readline = require('readline');
const csvWriter = require('csv-write-stream');
const yt = require('ytdl-core');
const debug = require('../bot.js');

var queue = [];
var music = {};
var skipCount = 3;
var currentSong = null;
var usersVotedSkip = [];
var queueList = "";
var songRepeat = false;
var tosend = [];
var musicEnd = false;
exports.run = (client, message, args) => {
    args = args.toString();
    music = args.split(" ").toString();
    console.log(music);

    doNotDelete = false;
    const voiceChannel = message.member.voiceChannel;

    if (message.channel.name !== "music") {
        message.delete();
        message.reply(":no_entry_sign: **NOPE:** You can only do music commands in the <#224405843016155136> channel.");
        return;
    }

    if (!voiceChannel) {
        message.reply(":no_entry_sign: **ERROR:** You aren't currently in a voice channel.");
        message.delete();
        return;
    }

    if (queue == null) {
        queue.push(music);
    }

    voiceChannel.join()
        .then(connection => {

            if (music == "skip") {
                if (voiceChannel.members.size < 2 || skipCount < 2 || message.member.roles.find("name", "Fleece Police")) {
                    if (usersVotedSkip.includes(message.author.id)) {
                        message.reply(":no_entry_sign: **NOPE:** You've already voted to skip!");
                        return;
                    }
                    usersVotedSkip = [];
                    skipCount = 3
                    yt.getInfo(currentSong, function(err, info) {
                        message.channel.send(":white_check_mark: **OK:** " + message.author + " skipped **" + info.title + "**.").then(() => {
                            dispatcher.end();
                        });
                        message.delete();
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
                }

            } else if (music == "queue") {
                if (queue == "") {
                    message.channel.send(":no_entry_sign: **ERROR:** There are no songs currently in the queue.");
                    return;
                }
                queue.forEach((item, i) => {
                    yt.getInfo(item, function(err, info) {
                        tosend.splice(i, 0, `${i+1}. ${info.title}\n`)
                        if (tosend.length == queue.length) {
                            queueMessage(tosend);
                        }
                    });
                });

                function queueMessage(mSend) {
                    mSend.sort();
                    message.channel.send(`__**${message.guild.name}'s Music Queue:**__ Currently **${mSend.length}** songs queued ${(mSend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${mSend.slice(0,15).join('\n')}\`\`\``);
                    tosend = [];
                }
                return;

            } else if (music == "next") {
                yt.getInfo(queue[0], function(err, info) {
                    message.channel.send(":fast_forward: **NEXT SONG:** " + info.title);
                    message.delete();
                });
                return;

            } else if (music == "repeat") {
                if (songRepeat == true) {
                    songRepeat = false;
                    message.channel.send(":repeat_one: Repeat is now turned off.");
                } else {
                    yt.getInfo(currentSong, function(err, info) {
                        message.channel.send(":repeat_one: **" + info.title + "** is now on repeat. Type `bot:music repeat` again to toggle off.");
                        message.delete();
                        songRepeat = true;
                    });
                }
                return;

            } else if (music == "end") {
                if (voiceChannel.members.size < 3 || message.member.roles.find("name", "Fleece Police")) {
                    queue = [];
                    musicEnd = true;
                    voiceChannel.leave();
                    message.channel.send(":mute: The queue was cleared by **" + message.author + "**.");
                    return;
                }
            }


            if (connection.speaking == true && music !== "skip" && music !== "queue" && music !== "next" && music !== "repeat" && music !== "end") {
                queue.push(music);
                return message.reply(":white_check_mark: **OK:** Your song has been placed in the queue.");
            }

            queue.push(music);
            queueMusic();

            function queueMusic() {
                if (music !== "skip" && music !== "queue" && music !== "next" && music !== "repeat" && music !== "end") {
                    currentSong = queue[0];
                }

                if (songRepeat == true) {
                    queue.push(currentSong);
                }

                if (connection.speaking == true && music !== "skip" && music !== "queue" && music !== "next" && music !== "repeat" && music !== "end") {
                    queue.push(music);
                    return message.reply(":white_check_mark: **OK:** Your song has been placed in the queue.");
                }
				
				if (debug.npEnabled == true) {
                yt.getInfo(queue[0], function(err, info) {
                    console.log("Now playing " + info.title)
                    message.channel.send(":headphones: **NOW PLAYING:** " + info.title);
                });
				}

                const streamOptions = {
                    seek: 0,
                    volume: 0.7
                };
                const streamfunc = yt(queue[0], {
                    filter: 'audioonly'
                });

                dispatcher = message.guild.voiceConnection.playStream(streamfunc, streamOptions);

                if (songRepeat == false) {
                    queue.shift();
                }

                dispatcher.on('end', () => {
                    if (musicEnd !== true) {
                        queueMusic(streamfunc);
                    } else {
                        console.log("Music ended.");
                    }
                });
            }

        });
    message.delete();
    return;
}