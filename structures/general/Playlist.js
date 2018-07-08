const Discord = require('discord.js');
const Settings = require('./Settings.js');
const PlaylistModel = require('./../../models/general/Playlist.js')
let api = require('./../../data/main/keys/keys.js')
api = new api()
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class Playlist {
	/*
	THINK ABOUT WHETHER TO ADD TO DATABASE, AND TRACK AUTOMOD POINTS THERE (easier yet less efficient)
	*/

	static async checkIfIDExists(id) {
		const count = await PlaylistModel.count({ where: { playlistID: id }} )
		if (count < 1) { return false; }
		else { return true; }
	}

	static async searchPlaylistByID(id) {
		if (!await Playlist.checkIfIDExists(id)) return false;
		const playlists = await PlaylistModel.findOne({ where: { playlistID: id }} )
		if (playlists == null) return false;
		return playlists;
	}

	static async searchPlaylistByName(id, guild) {
		const playlists = await PlaylistModel.findAll({
	    attributes: ['userID', 'guildID', 'playlistID', 'playlistName', 'playlistPrivacy', 'songs'],
	    where: { playlistName: { [Op.iLike]: '%' + id + '%' } },
	    raw: true
	  });
		if (playlists == null) return false;
		return playlists;
	}

	static async editable(playlist, user) {
		var privacy = await Playlist.searchPlaylistByID(playlist);
		return (privacy.userID == user.id);
	}

	static async addSong(playlist, user, object) {
		const playlistAdd = await PlaylistModel.findOne({ where: { userID: user.id, playlistID: playlist}} )
		if (playlistAdd == null) return false;
		var newObj = playlistAdd.songs;
		newObj.object.push(object)
		PlaylistModel.update({ songs: newObj }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async massAddSong(playlist, user, arrObj) {
		const playlistAdd = await PlaylistModel.findOne({ where: { userID: user.id, playlistID: playlist}} )
		if (playlistAdd == null) return false;
		var newObj = playlistAdd.songs;
		for (let i in arrObj) {
			newObj.object.push(arrObj[i])
		}
		PlaylistModel.update({ songs: newObj }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async removeSong(playlist, user, index) {
		const playlistAdd = await PlaylistModel.findOne({ where: { userID: user.id, playlistID: playlist}} )
		if (playlistAdd == null) return false;
		var newObj = playlistAdd.songs;
		var removedSong = newObj.object[index].title;
		newObj.object.splice(index, 1)
		PlaylistModel.update({ songs: newObj }, { where: { userID: user.id, playlistID: playlist } });
		return removedSong;
	}

	static async massRemoveSong(playlist, user, index, index2) {
		const playlistAdd = await PlaylistModel.findOne({ where: { userID: user.id, playlistID: playlist}} )
		if (playlistAdd == null) return false;
		var newObj = playlistAdd.songs;
		newObj.object.splice(index, index2-index)
		PlaylistModel.update({ songs: newObj }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async removeAllSongs(playlist, user, arrObj) {
		const playlistAdd = await PlaylistModel.findOne({ where: { userID: user.id, playlistID: playlist}} )
		if (playlistAdd == null) return false;
		PlaylistModel.update({ songs: {"object": []} }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async editAvatar(playlist, user, avatarURL) {
		PlaylistModel.update({ playlistAvatar: avatarURL }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async editName(playlist, user, name) {
		PlaylistModel.update({ playlistName: name }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async editDescription(playlist, user, description) {
		PlaylistModel.update({ playlistDescription: description }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async editPrivacy(playlist, user, privacy) {
		PlaylistModel.update({ playlistPrivacy: privacy }, { where: { userID: user.id, playlistID: playlist } });
	}

	static async incrementView(playlist, user) {
		const playlistView = await PlaylistModel.findOne({ where: { playlistID: playlist }} )
		if (playlistView == null) return false;
		var newObj = playlistView.views;
		if (newObj.users.indexOf(user.id) > -1) return;
		newObj.users.push(user.id)
		newObj.count += 1
		PlaylistModel.update({ views: newObj }, { where: { playlistID: playlist } });
	}

	static async addStar(playlist, user) {
		const playlistStar = await PlaylistModel.findOne({ where: { playlistID: playlist }} )
		if (playlistStar == null) return false;
		var newObj = playlistStar.stars;
		if (newObj.users.indexOf(user.id) > -1) return;
		newObj.users.push(user.id)
		newObj.count += 1
		PlaylistModel.update({ stars: newObj }, { where: { playlistID: playlist } });
	}

	static async hasStarred(playlist, user) {
		const playlistStar = await PlaylistModel.findOne({ where: { playlistID: playlist }} )
		if (playlistStar == null) return false;
		var newObj = playlistStar.stars;
		if (newObj.users.indexOf(user.id) > -1) { return true; } else { return false; }
	}

	static async removeStar(playlist, user) {
		const playlistStar = await PlaylistModel.findOne({ where: { playlistID: playlist }} )
		if (playlistStar == null) return false;
		var newObj = playlistStar.stars;
		if (newObj.users.indexOf(user.id) > -1) {
			newObj.users.splice(newObj.users.indexOf(user.id), 1)
			newObj.count -= 1
		} else {
			return false;
		}
		PlaylistModel.update({ stars: newObj }, { where: { playlistID: playlist } });
	}

	static async convertPlaylist(playlist) {
		const playlistAdd = await PlaylistModel.findOne({ where: { userID: user.id, playlistID: playlist}} )
		if (playlistAdd == null) return false;
		var newObj = playlistAdd.songs;
		if (newObj[0].track == undefined) { pl
 			return true
		} else {
			return false;
		}
	}

	static async convertAllPlaylists(message) {
		let pusher = [];
		const snekfetch = require('snekfetch');
		const playlists = await PlaylistModel.findAll({
	    attributes: ['userID', 'guildID', 'playlistID', 'playlistName', 'playlistPrivacy', 'songs'],
	    raw: true
	  });
		for (let i in playlists) {
			let songs = playlists[i].songs;
			if (songs.object !== undefined) {
				for (let o in songs.object) {
				if (songs[o] !== undefined) {
				if (songs[o].track == undefined) {
					async function getSongs(search) {
						try {
							const { body } = await snekfetch.get(`http://localhost:2333/loadtracks?identifier=${search}`)
									.set("Authorization", api.lavalink)
									.set("Accept", "application/json");
							if (!body) return `No tracks found`;
							return body;
						} catch (err) {
							throw err;
						}
					}
						const tryPrefixes = ["ytsearch:", "scsearch:"]
						let [video] = await getSongs(songs[o].url);
						if (!video) {
							for (let i in tryPrefixes) {
								video = await getSongs(tryPrefixes[i] + searchString);
								if (video) break;
							}
						}
						if (video) {
							video = (video[0] == undefined ? video : video[0]);
							let obj = { id: video.info.identifier, url: `https://www.youtube.com/watch?v=${video.info.identifier}`, title: video.info.title, duration: video.info.length, track: video.track, stream: video.info.isStream }
							pusher.push(obj);
						}
					} else {
						return false;
					}
			}
			PlaylistModel.update({ songs: {"object": pusher} }, { where: { playlistID: playlists[i].playlistID } });
			}
		}
		}
	}
}

module.exports = Playlist;
