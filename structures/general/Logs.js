const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const Settings = require('./Settings.js');

class Logs {
	static logging(guild, log) {

	}

	static get logObject() {
			return {
			message: {
				all: {enabled: false, channels: []},
				modules: {
					edit: {enabled: true, channels: []},
					delete: {enabled: true, channels: []},
					expletive: {enabled: false, channels: []},
					spam: {enabled: false, channels: []}
				}
			},
			member: {
				all: {enabled: false, channels: []},
				modules: {
					join: {enabled: false, channels: []},
					leave: {enabled: false, channels: []}
				}
			},
			moderation: {
				all: {enabled: false, channels: []},
				modules: {
					voice: {enabled: false, channels: []},
					punishments: {enabled: true, channels: []},
					edit_punishments: {enabled: false, channels: []},
					delete_punishments: {enabled: false, channels: []},
					commands: {enabled: false, channels: []},
					member_join: {enabled: false, channels: []},
					member_leave: {enabled: false, channels: []},
					member_update: {enabled: false, channels: []}
				}
			},
			other: {
				enabled: {enabled: false, channels: []},
				modules: {}
			}
		}
	}

	static grabLoggingSettings() {
		//this would be similar to how to we grab info using playlists and autoresponses
	}

}

module.exports = Logs;
