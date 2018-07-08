exports.settings = {command: "play", description: "Automatically joins your voice channel and plays a specified song.", usage: "play (query | playlist:[playlist id])", throttle: {usages: 4, duration: 10} }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const api = new (require("./../../data/main/keys/keys.js"))()
	const moment = require("moment")
	const Playlist = require("./../../structures/general/Playlist.js")
	const Settings = require("./../../structures/general/Settings.js")
	const Find = require("./../../structures/internal/Find.js")
	const snekfetch = require("snekfetch")
	const delayer = time => new Promise(res => setTimeout(() => res(), time));
	const queue = client.queue
	const musicAccount = "https://cdn1.iconfinder.com/data/icons/google_jfk_icons_by_carlosjj/512/music.png"
	const searchString = args.slice(0).join(" ")
	const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : ""
	const voiceChannel = message.member.voiceChannel

	function generateEmbed(arr, currentPage) {
		const pageLength = 5
		const objects = arr
		arr.sort(function(a,b) {return (a.user == b.user) ? 1 : ((b.user == a.user) ? -1 : 0)} )
		arr.sort(function(a,b) {return (a.privacy > b.privacy) ? 1 : ((b.privacy > a.privacy) ? -1 : 0)} )
		arr = arr.map(function (i, num = 1){
			num += 1
			return `\`${num}.\` ${i.display}\n`
		})
		const displayPlaylists = arr.splice(pageLength + (currentPage - 2) * pageLength, pageLength)
		arr = objects
		const embed = new Discord.MessageEmbed()
		embed.setFooter(`Playlist Selection - Page ${currentPage} of ${Math.ceil(arr.length / pageLength)}`)
		embed.setDescription(`${client.util.emoji("info", message.guild)} You can type **__c__ancel** at anytime to cancel this selection.`)
		embed.setAuthor(`Playlist Selection » ${message.author.tag}`, client.user.displayAvatarURL());
		(displayPlaylists.length < 1 ? "No playlists." : embed.addField("Playlists", displayPlaylists.join("\n"), true))
		embed.setColor("#26a69a")
		return embed
	}

	function callReactions(embedMessage, arr, currentPage) {
		embedMessage.awaitReactions(function(reaction) { if (reaction.count > 1 && reaction.users.has(message.author.id)) {return true} return false }, { max: 1 })
			.then(collected => {
				collected.first().remove(message.author.id)
				if (collected.first().client.util.emoji.name === "⏮") {
					if (currentPage - 1 > 0) currentPage--
				} else if (collected.first().client.util.emoji.name === "⏭") {
					if (currentPage + 1 < Math.ceil(arr.length / 5)) currentPage++
				}
				callReactions(embedMessage, arr, currentPage)
				const editEmbed = generateEmbed(arr)
				embedMessage.edit({ embed: editEmbed })
			})
	}

	async function queuePlaylist(search, type) {
		if (search == undefined) return
		let forin
		let count = 0
		console.log(search)
		if (type === "youtube") {
			forin = search
		} else {
			forin = search.songs.object
		}
		for (const i in forin) {
			count++
			if (count > 250) break
			console.log(forin[i])
			forin[i].requester = message.author;
			if (type === "youtube") {
				message.guild.music.add(forin[i], message.author)
			} else {
				message.guild.music.add(forin[i], message.author)
			}
		}
		if (type !== "youtube") await Playlist.incrementView(search.id, message.author)
		let playlistBody
		if (type == "youtube") playlistBody = await snekfetch.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${searchString.split("=")[1]}&key=${api.lavalink}`)

		const embed = new Discord.MessageEmbed()
			.setAuthor(`Music Added » ${message.author.tag}`, message.author.avatarURL({ format: "png" }))
			.setDescription(`${client.util.emoji("ok", message.guild)} I've added the playlist ${type === "youtube" ? `[**${playlistBody.body.items[0].snippet.title}**](${searchString})` : `**${search.name}**`} into the queue.${count > 250 ? `${client.util.emoji("info", message.guild)} Only the first \`250\` videos have been queued.` : ""}`)
			.setColor("#d4e157")
			.setFooter(`zBot Music Player - ${message.guild.music.queue.length} ${message.guild.music.queue.length == 1 ? "song" : "songs"} queued`, musicAccount)
		message.channel.zend({ embed })
	}

	if (url == "" && searchString == "") return message.zreply(`${client.util.emoji("nope", message.guild)} You need to provide a video to play, or use one of the sub-commands. ` + `See \`${await message.guild.prefix}help play\` for more information.`)
	encodeURIComponent(searchString)
	encodeURIComponent(url)

	if (!voiceChannel) return message.zreply(`${client.util.emoji("nope", message.guild)} You aren't currently in a voice channel.`)

	async function results() {
		if (!searchString.startsWith("playlist:")) {
			const result = await message.guild.music.search(searchString)
			if (!result) throw new Error(`An internal error has occured.\nTechnical information: \`result\` is falsey, equal to ${result}`)

			if (result.playlist) {
				queuePlaylist(result.video, "youtube")
			} else {
				return result
			}
		} else {
			const name = searchString.split("playlist:")[1]
			let playlistToSelect
			if (await Playlist.checkIfIDExists(name)) { // Check if user input an ID
				playlistToSelect = await Playlist.searchPlaylistByID(name, message.guild)
				if (!playlistToSelect) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a playlist with that ID.`)
			} else {
				playlistToSelect = await Playlist.searchPlaylistByName(name, message.guild)
				if (!playlistToSelect) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a playlist with that name.`)
			}
			for (const i in playlistToSelect) {
				if ((playlistToSelect[i].playlistPrivacy == 2 && message.author.id !== playlistToSelect[i].userID) || (playlistToSelect[i].playlistPrivacy == 1 && playlistToSelect[i].guildID !== message.guild.id)) {
					playlistToSelect.splice(i, 1)
				}
			}
			if (playlistToSelect.length == 0) {
				return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't find a playlist with that name.`)
			} else if (playlistToSelect.length == 1) {
				playlistToSelect = playlistToSelect[0]
				queuePlaylist({"id": playlistToSelect.playlistID, "user": playlistToSelect.userID, "name": playlistToSelect.playlistName, "privacy": playlistToSelect.playlistPrivacy, "songs": playlistToSelect.songs}, "playlist")
			} else {
				const playlists = playlistToSelect
				const playlistArr = []
				const currentPage = 1
				for (const index in playlists) {
					const playlistObj = playlists[index]
					const displayPrivacy = (playlistObj.playlistPrivacy == 0 ? "Public" : (playlistObj.playlistPrivacy == 1 ? "Visible to guild" : "Private"))
					if (playlistObj.songs.object !== undefined) {
						if ((playlistObj.playlistPrivacy == 2 && message.author.id == playlistObj.userID) || (playlistObj.playlistPrivacy == 1 && playlistObj.guildID == message.guild.id) || playlistObj.playlistPrivacy == 0) {
							const msg = `**${playlistObj.playlistName}** ── Created by \`${playlistObj.userID == message.author.id ? "you" : "someone"}\`\n*${displayPrivacy} ── ${playlistObj.songs.object.length} songs*`
							playlistArr.push({"id": playlistObj.playlistID, "user": playlistObj.userID, "name": playlistObj.playlistName, "display": msg, "privacy": playlistObj.playlistPrivacy, "songs": playlistObj.songs})
						}
					}
				}

				message.zreply(`${client.util.emoji("empty", message.guild)} Multiple playlists were found under that name.\nTo choose the playlist you would like to select, type it's number next to the playlist's name in the chat.\nYou can also use the reactions on the embed to flip through different pages.`)

				const embed = generateEmbed(playlistArr, currentPage)
				message.channel.zend({ embed }).then(embedMessage => {
					const filter = m => m.author == message.author
					message.channel.awaitMessages(filter, { max: 1 })
						.then(collected => {
							if (collected.first().content.startsWith("c")) return message.zreply(`${client.util.emoji("ok", message.guild)} Playlist selection was cancelled.`)
							const playlistObject = playlistArr[Number(Number(collected.first().content) - 1)]
							if (playlistObject == undefined) return message.zreply(`${client.util.emoji("nope", message.guild)} You've provided an invalid number. Exiting selection menu.`)
							queuePlaylist(playlistObject, "playlist")
						})

					embedMessage.react("⏮").then(() => {
						embedMessage.react("⏭")
					})
					callReactions(embedMessage, playlistArr, currentPage)
				})
			}
		}
	}

 	let video = await results();
	video = video[0] || video;
	if (!video || video.length < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't any results under that search.`)
	if (video.info.length > 7200000 && !video.info.isStream && !message.author.patron) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't queue songs longer than 2 hours.`)

		try {
			 	if (!message.guild.music.playing || !message.guild.music.voiceChannel) message.guild.music.join(message);
				if (message.guild.music.playing) {
					message.guild.music.add(video, message.author);
					const d = moment.duration({ ms: video.info.length })
					const embed = new Discord.MessageEmbed()
						.setAuthor(`Music Added » ${message.author.tag}`, message.author.avatarURL({ format: "png" }))
						.setDescription(`${client.util.emoji("ok", message.guild)} I've added **[${video.info.title}](${video.info.uri})** into the queue. \`(${moment().startOf("day").add(d).format("HH:mm:ss")})\``)
						.setColor("#d4e157")
						.setFooter('zBot Music Player - ' + message.guild.music.queue.length + ' ' + (message.guild.music.queue.length == 1 ? "song" : "songs") + ' queued', musicAccount)
					return message.channel.zend({ embed })
				} else {
					message.guild.music.add(video, message.author);
					await delayer(500);
					await play();
				}
		} catch (er) {
				throw er
		}

		async function play() {
			const song = message.guild.music.queue[0];
			if (!song) return message.channel.zend(`${client.util.emoji("info", message.guild)} **MUSIC**: There are no more songs left in the queue.`)
			.then(() => message.guild.music.destroy());

			const nowPlayingTrue = await Settings.getValue(message.guild, "musicDisplayNowPlaying");
			if (nowPlayingTrue === undefined) client.util.log("Failed to retrieve `musicDisplayNowPlaying` settings for this guild", "critical")

			return message.guild.music.play().then(async player => {
					if (nowPlayingTrue && !message.guild.music.repeat.single) {
							let d = moment.duration({ ms: song.duration });
							const embed = new Discord.MessageEmbed()
							.addField('Music Playing', `:headphones: **[${song.title}](${song.url})** is now playing. ` + (song.duration == 0 ? ` (${moment().startOf('day').add(d).format('HH:mm:ss')})` : ``), true)
							.setColor("#9ccc65")
							.setFooter('zBot Music Player - ' + message.guild.music.queue.length + ' ' + (message.guild.music.queue.length == 1 ? "song" : "songs") + ' queued', musicAccount)
							message.channel.zend({ embed })
					}
					player.once("end", data => {
							if (data.reason === "REPLACED") return;
							message.guild.music.queue.shift();
							play();
					});
			});
		}

}
