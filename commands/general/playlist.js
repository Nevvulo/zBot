const userSelected = {}
exports.settings = { command: "playlist", description: "Allows you to create, play and share your own personalized playlist.",
	usage: ["playlist create (name)", "playlist select (id or name)", "playlist add (song name/url)", "playlist remove (song index)", "playlist edit (name (string) | description (string) | privacy (public | guild | private))", "playlist songs", "playlist star", "playlist list [star]"],
	throttle: { usages: 3, duration: 10 } }
exports.run = async (client, message, args) => {
	const Discord = require("discord.js")
	const Settings = require("./../../structures/general/Settings.js")
	const Playlist = require("./../../structures/general/Playlist.js")
	const Find = require("./../../structures/internal/Find.js")
	const PlaylistModel = require("./../../models/general/Playlist.js")
	const { Interface } = require("./../../structures/internal/Interface.js")
	const moment = require("moment")
	const subcommand = (args[0] == undefined ? "" : args[0])
	const secondsubcommand = (args[1] == undefined ? "" : args[1])
	const name = args.slice(1).join(" ")
	const description = args.slice(2).join(" ")
	const thirdsubcommand = (args[2] == undefined ? "" : args[2])
	const prefix = await Settings.getValue(message.guild, "prefix")
	const searchString = args.slice(1).join(" ")

	async function checkIfSelected() {
		if (!userSelected.hasOwnProperty(message.author.id)) userSelected[message.author.id] = {}, userSelected[message.author.id].selected = "0"
		const selectedPlaylist = await Playlist.searchPlaylistByID(userSelected[message.author.id].selected, message.guild)
		if (!selectedPlaylist || userSelected[message.author.id].selected == "0") return false
		return selectedPlaylist
	}

	async function createPlaylist(pname) {
		const id = Math.random().toString(36).substring(6)
		if (await Playlist.checkIfIDExists(id)) {
			createPlaylist()
		} else {
			PlaylistModel.create({
				userID: message.author.id,
				guildID: message.guild.id,
				playlistID: id,
				playlistName: pname,
				playlistAvatar: null,
				playlistDescription: null,
				playlistPrivacy: 0, // playlist is public by default
				songs: { "object": [] }, // this would be an object from `music` when queueing but its empty
				stars: { "count": 0, "users": [] },
				views: { "count": 0, "users": [] }
			}) // users is an array filled with user id's of people who have starred/viewed
		}
		if (!userSelected.hasOwnProperty(message.author.id)) userSelected[message.author.id] = {}, userSelected[message.author.id].selected = "0"
		userSelected[message.author.id].selected = id
		return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully created playlist **${name}**.`)
	}

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

	if (subcommand == "create") {
		createPlaylist(name)
	} else if (subcommand == "select") {
		if (!userSelected.hasOwnProperty(message.author.id)) userSelected[message.author.id] = {}, userSelected[message.author.id].selected = "0"
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
			userSelected[message.author.id].selected = playlistToSelect.playlistID
			return message.zreply(`${client.util.emoji("ok", message.guild)} You have selected the playlist **${playlistToSelect.playlistName}**.`)
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
						playlistArr.push({"id": playlistObj.playlistID, "user": playlistObj.userID, "name": playlistObj.playlistName, "display": msg, "privacy": playlistObj.playlistPrivacy})
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
						userSelected[message.author.id].selected = playlistObject.id
						return message.zreply(`${client.util.emoji("ok", message.guild)} You have selected the playlist **${playlistObject.name}**.`)
					})

				embedMessage.react("⏮").then(() => {
					embedMessage.react("⏭")
				})
				callReactions(embedMessage, playlistArr, currentPage)
			})
		}
	} else if (subcommand == "add") {
		const selectedPlaylist = await checkIfSelected()
		if (!selectedPlaylist) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to select a playlist first using \`${prefix}playlist select (playlist name | playlist id)\`!`)
		if (await Playlist.editable(userSelected[message.author.id].selected, message.author)) {
			resolve(userSelected[message.author.id].selected)
		} else {
			return message.zreply(`${client.util.emoji("nope", message.guild)} You aren't the creator of this playlist, so you can't add songs.`)
		}
	} else if (subcommand == "remove") {
		const selectedPlaylist = await checkIfSelected()
		if (!selectedPlaylist) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to select a playlist first using \`${prefix}playlist select (playlist name | playlist id)\`!`)
		let caseObj
		if (await Playlist.editable(userSelected[message.author.id].selected, message.author)) {
			if (secondsubcommand == "playlist") {
				message.channel.zend(`${client.util.emoji("warning", message.guild)} You are about to perform a potentially destructive action. Are you sure you want to remove this playlist (**${selectedPlaylist.playlistName}**)? *(__y__es | __n__o)*\nOnce this action is completed, **it cannot be undone**.`)
				const filter = m => m.author == message.author
				let confirmed = false
				message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
					.then(collected => {
						if (collected.first().content.startsWith("y")) {
							confirmed = true
							PlaylistModel.destroy({ where: { userID: message.author.id, playlistID: selectedPlaylist.playlistID } })
							return message.channel.zend(`${client.util.emoji("ok", message.guild)} Your playlist **${selectedPlaylist.playlistName}** was removed.`)
						}
						if (collected.first().content.startsWith("n")) {
							confirmed = true
							return message.channel.zend(`${client.util.emoji("ok", message.guild)} I won't remove **${selectedPlaylist.playlistName}**.`)
						}
					})
					.catch(() => {
						if (confirmed === false) {
							return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} Removing this playlist won't be completed because you didn't reply with an answer in time.`)
						}
					})
			} else if (name.includes("-")) {
				caseObj = []
				if (isNaN(parseInt(name.split("-")[0])) || isNaN(parseInt(name.split("-")[1]))) return message.zreply(`${client.util.emoji("nope", message.guild)} Your selection contains an invalid number.`)
				for (let i=parseInt(name.split("-")[0]); i <= parseInt(name.split("-")[1]); i++) {
					caseObj.push(i)
				}
				if (Number(name) > selectedPlaylist.songs.object.length) return message.zreply(`${client.util.emoji("nope", message.guild)} You've provided a song index that doesn't exist in your playlist.`)
				await Playlist.massRemoveSong(userSelected[message.author.id].selected, message.author, Number(Number(caseObj[0]) - 1), Number(Number(caseObj[caseObj.length-1]) - 1))
				return message.zreply(`${client.util.emoji("ok", message.guild)} You have removed \`songs ${caseObj[0]} to ${caseObj[caseObj.length-1]}\` from **${selectedPlaylist.playlistName}**.`)
			} else {
				if (isNaN(Number(name)) || Number(name) < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid song index.`)
				if (Number(name) > selectedPlaylist.songs.object.length) return message.zreply(`${client.util.emoji("nope", message.guild)} You've provided a song index that doesn't exist in your playlist.`)
				const removed = await Playlist.removeSong(userSelected[message.author.id].selected, message.author, Number(Number(name) - 1))
				return message.zreply(`${client.util.emoji("ok", message.guild)} You have removed \`${removed}\` from **${selectedPlaylist.playlistName}**.`)
			}
		} else {
			return message.zreply(`${client.util.emoji("nope", message.guild)} You aren't the creator of this playlist, so you can't remove songs.`)
		}
	} else if (subcommand == "edit") {
		const selectedPlaylist = await checkIfSelected()
		if (!selectedPlaylist) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to select a playlist first using \`${prefix}playlist select (playlist name | playlist id)\`!`)
		if (await Playlist.editable(userSelected[message.author.id].selected, message.author)) {
			if (secondsubcommand == "name") {
				Playlist.editName(selectedPlaylist.playlistID, message.author, thirdsubcommand)
				return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully edited the playlist name for **${selectedPlaylist.playlistName}**.`)
			} else if (secondsubcommand == "description") {
				Playlist.editDescription(selectedPlaylist.playlistID, message.author, description)
				return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully edited the playlist description for **${selectedPlaylist.playlistName}**.`)
			} else if (secondsubcommand == "privacy") {
				let privacyEdit = (isNaN(Number(thirdsubcommand)) ? (thirdsubcommand == "public" ? privacyEdit = 0 : (thirdsubcommand == "private" ? privacyEdit = 2 : (thirdsubcommand.startsWith("guild") ? privacyEdit = 1 : privacyEdit = -1))) : Number(thirdsubcommand))
				if (privacyEdit < 0 || privacyEdit > 2) return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid privacy setting. Try \`public\`, \`guild\` or \`private\`, or alternatively use numbers \`0\` to \`2\`.`)
				Playlist.editPrivacy(selectedPlaylist.playlistID, message.author, Number(privacyEdit))
				const displayPrivacy = (selectedPlaylist.playlistPrivacy === 0 ? "Public" : (selectedPlaylist.playlistPrivacy === 1 ? "Visible to guild" : "Private"))
				return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully updated the playlist privacy of **${selectedPlaylist.playlistName}** to be \`${displayPrivacy}\`.`)
			} else {
				return message.zreply(`${client.util.emoji("nope", message.guild)} That's not a valid property to edit on your playlist.`)
			}
		} else {
			return message.zreply(`${client.util.emoji("nope", message.guild)} You aren't the creator of this playlist, so you can't edit it.`)
		}
	} else if (subcommand == "star") {
		const selectedPlaylist = await checkIfSelected()
		if (!selectedPlaylist) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to select a playlist first using \`${prefix}playlist select (playlist name | playlist id)\`!`)
		const star = await Playlist.hasStarred(selectedPlaylist.playlistID, message.author)
		if (!star) {
			await Playlist.addStar(selectedPlaylist.playlistID, message.author)
			return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully starred **${selectedPlaylist.playlistName}**.`)
		} else {
			await Playlist.removeStar(selectedPlaylist.playlistID, message.author)
			return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully removed your star from **${selectedPlaylist.playlistName}**.`)
		}
	} else if (subcommand == "list") { // TODO: make a "star" / "starred" subcommand for this
		const playlists = await PlaylistModel.findAll({
			attributes: ["userID", "playlistID", "playlistName", "songs"],
			where: { userID: message.author.id },
			raw: true,
		})
		const playlistArr = []
		for (const index in playlists) {
			const playlistObj = playlists[index]
			if (playlistObj.songs.object !== undefined) {
				const msg = `**${playlistObj.playlistName}** ── ${playlistObj.songs.object.length} songs`
				playlistArr.push(msg)
			}
		}
		if (playlistArr.length < 1) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} You have no playlists. You can use \`${await Settings.getValue(message.guild, "prefix")}playlist create (name)\` to create one.`)
		new Interface().PaginationMenu(playlistArr, {
			title: `Playlists » ${message.author.tag}`,
			author: message.guild.iconURL(),
			type: "Playlists",
			color: "#26a69a",
			description: `${client.util.emoji("ok", message.guild)} Here are all of your playlists that you have created.`,
			pageLength: 10,
			delimiter: "\n"
		}, message, secondsubcommand)
	} else if (subcommand == "songs") {
		const selectedPlaylist = await checkIfSelected()
		if (!selectedPlaylist) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to select a playlist first using \`${prefix}playlist select (playlist name | playlist id)\`!`)
		const songsArr = []
		for (const i in selectedPlaylist.songs.object) {
			const songObj = selectedPlaylist.songs.object[i]
			const msg = `\`${Number(Number(i)+1)}.\` **[${songObj.title}](${songObj.url})**`
			songsArr.push(msg)
		}
		if (songsArr.length < 1) return message.channel.zend(`${client.util.emoji("incomplete", message.guild)} There are no songs in this playlist.`)
		new Interface().PaginationMenu(songsArr, {
			title: `Songs » ${selectedPlaylist.playlistName}`,
			author: message.guild.iconURL(),
			type: `Songs in ${selectedPlaylist.playlistName}`,
			color: "#26a69a",
			description: `${client.util.emoji("ok", message.guild)} Here is a list of all the songs in the playlist \`${selectedPlaylist.playlistName}\`.\nTo see the second page, type \`${prefix}playlist songs 2\``,
			pageLength: 10,
			delimiter: "\n"
		}, message, secondsubcommand)
	} else {
		const selectedPlaylist = await checkIfSelected()
		if (!selectedPlaylist) return message.zreply(`${client.util.emoji("nope", message.guild)} You need to select a playlist first using \`${prefix}playlist select (playlist name | playlist id)\`!`)
		const embed = new Discord.MessageEmbed()
		embed.setAuthor(`Playlist » ${selectedPlaylist.playlistName}`, client.user.displayAvatarURL())
		embed.setDescription(`${client.util.emoji("info", message.guild)} Here is some information on the playlist \`${selectedPlaylist.playlistName}\`.`)
		let msg = `**NAME** ─ ${selectedPlaylist.playlistName}\n`
		msg += `**ID** ─ ${selectedPlaylist.playlistID}\n`
		msg += `**PRIVACY** ─ ${selectedPlaylist.playlistPrivacy == 0 ? "Public" : (selectedPlaylist.playlistPrivacy == 1 ? "Visible to guild" : "Private")}\n`
		msg += `**DESCRIPTION** ─ ${selectedPlaylist.playlistDescription == null ? "*No description.*" : selectedPlaylist.playlistDescription}\n\n`
		msg += `**SONGS** ─ ${selectedPlaylist.songs.object.length}\n`
		msg += `**VIEWS** ─ ${selectedPlaylist.views.count} views\n`
		msg += `**STARS** ─ \\⭐ ${selectedPlaylist.stars.count}\n`;
		(selectedPlaylist.playlistAvatar == null ? "" : embed.setThumbnail(selectedPlaylist.playlistAvatar))
		embed.addField("Information", msg)
		embed.setFooter(`Playlist created on ${moment(selectedPlaylist.createdAt).format("Do [of] MMMM, YYYY [at] h:mm:ss a")}`)
		embed.setColor("#26a69a")
		return message.channel.zend({ embed })
	}

	async function resolve(playlistID) {
		let video = await message.guild.music.search(searchString)
		video = video[0] || video;
		console.log(video)
		if (video.playlist) {
			await Playlist.massAddSong(playlistID, message.author, video.video)
			return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully added the songs from your YouTube playlist to your playlist.`)
		} else {
			const song = { id: video.info.identifier, url: video.info.uri, title: video.info.title, duration: video.info.length, track: video.track, stream: video.info.isStream }
			if (!song || song.length < 1) return message.zreply(`${client.util.emoji("nope", message.guild)} I couldn't any results under that search.`)
			if (song.duration > 7200000 && !song.stream && !message.author.patron) return message.zreply(`${client.util.emoji("nope", message.guild)} You can't add songs that are longer than 2 hours.`)
			await Playlist.addSong(playlistID, message.author, song)
			return message.zreply(`${client.util.emoji("ok", message.guild)} You have successfully added the song **${song.title}** to your playlist.`)
		}
	}
}
