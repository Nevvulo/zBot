const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const main = require('./../../bot.js')
const SettingsModel = require('./../../models/Settings.js')

var settingsList = {
	"expletiveFilter": false,
	"spamFilter": true,
	"moderatorRole": "Moderator",
	"muteRole": "Muted",
	"prefix": "+",
	"experienceTracking": true,
	"musicDisplayNowPlaying": false,
	"modLogsChannel": 0,
	"memberLogsChannel": 0,
	"joinMessageEnabled": false,
	"joinMessage": null,
	"joinMessageChannel": 0
};

class Settings {
	static newGuild(guild) {
		SettingsModel.create({ guildID: guild.id,
											expletiveFilter: false,
											spamFilter: true,
											moderatorRole: "Moderator",
											muteRole: "Muted",
											prefix: "+",
											experienceTracking: true,
											musicDisplayNowPlaying: false,
											modLogsChannel: 0,
											memberLogsChannel: 0,
											joinMessageEnabled: false,
											joinMessage: null,
											joinMessageChannel: 0 });
	}

	static async getAllSettings(guild) {
		const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
		if (guild == "") return settingsList
		return guildSettings.dataValues;
	}

	static async checkGuild(guild) {
		const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
		try {
			eval(guildSettings.expletiveFilter)
		} catch (error) {
			if (error) log(colors.bold("Guild successfully vacuumed ▪ " + guild.name) + " (" + guild.id + ")", logType.success)
			Settings.newGuild(guild)
		}

	}

	static async checkGuildSettings(guild) {
		const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
		var configSettingsList = settingsList;

		try {
			var configSettings = configSettingsList
			Object.entries(configSettings).forEach(
    		([key, value]) => {
				const setting = key;
				const settingvalue = value;

				if (eval(`guildSettings.${setting}`) === undefined) {
					log(colors.bold("Guild setting successfully vacuumed ▪ " + setting + " in " + guild.name) + " (" + guild.id + ")", logType.success)
					Settings.editSetting(guild, setting, settingvalue)
				}
				}
			);
		} catch (error) {
			log(error, logType.critcal)

		}
	}

	static async removeGuild(guild) {
	 	await SettingsModel.delete({ where: { guildID: guild.id } });
	}

	static async getValue(guild, setting) {
		if (guild == null) return;
		const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
		try {
		return eval(`guildSettings.${setting}`)
	} catch (err) {
		log("Error occured whilst grabbing guild " + guild.id + " for setting " + setting + ".", logType.critical)
	}
	}

	static async editSetting(guild, setting, value) {
		if (value == true || value == false) {
			eval(`SettingsModel.update({ ${setting}: ${value} }, { where: { guildID: guild.id } })`);
		} else {
		eval(`SettingsModel.update({ ${setting}: "${value}" }, { where: { guildID: guild.id } })`);
	}
	}


}

module.exports = Settings;
