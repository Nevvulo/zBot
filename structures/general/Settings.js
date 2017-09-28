const Discord = require('discord.js');
const fs = require('fs');
const main = require('./../../bot.js')
const Config = JSON.parse(fs.readFileSync('./data/main/settings/Settings.json', 'utf8'));

class Settings {

	static loadConfig() {
		log("Loading zBot configuration file...", logType.info);

        try {
            return Config;
        } catch (err) {
            //Try loading the prewrite file
            return JSON.parse(fs.readFileSync("./data/main/settings/settings.prewrite.json", "utf8"));

            log("Settings file was corrupted, but prewrite file is good. Using prewrite file.", logType.warning);

            fs.createReadStream('./data/main/settings/Settings.json').pipe(fs.createWriteStream('./data/main/settings/.settings-backup.json'));
            fs.createReadStream('./data/main/settings/settings.prewrite.json').pipe(fs.createWriteStream('./data/main/settings/Settings.json'));
        }
	}


	static newGuild(guild) {
		Config[guild.id] = {
        "requiresConfig": true,
				"expletiveFilter": false,
				"spamFilter": true,
				"moderatorRole": "Moderator",
				"muteRole": "Muted",
				"prefix": "+",
				"experienceTracking": true,
				"musicNPModule": false,
				"modLogsChannel": 0,
				"memberLogsChannel": 0,
				"joinMessageEnabled": false,
				"joinMessage": null,
				"joinMessageChannel": 0
    };
	}

	static checkGuild(guild) {
		try {
			eval(Config[guild.id].requiresConfig)
		} catch (error) {
			if (error) log("Guild successfully vacuumed: " + guild.name + " (" + guild.id + ")", logType.success)
			Settings.newGuild(guild)
		}

	}

	static checkGuildSettings(guild) {
		var configSettingsList = {
        "requiresConfig": true,
				"expletiveFilter": false,
				"spamFilter": true,
				"moderatorRole": "Moderator",
				"muteRole": "Muted",
				"prefix": "+",
				"experienceTracking": true,
				"musicNPModule": false,
				"modLogsChannel": 0,
				"memberLogsChannel": 0,
				"joinMessageEnabled": false,
				"joinMessage": null,
				"joinMessageChannel": 0
    };

		try {
			var configSettings = configSettingsList
			console.log(configSettings)
			Object.entries(configSettings).forEach(
    		([key, value]) => {
				const setting = key;
				const settingvalue = value;
				console.log(`Config[guild.id].${setting}`)
				console.log(eval(`Config[guild.id].${setting}`) === undefined)
				if (eval(`Config[guild.id].${setting}`) === undefined) {
					log("Guild setting successfully vacuumed: SETTING " + setting + " in " + guild.name + " (" + guild.id + ")", logType.success)
					console.log(eval(`configSettings.${setting}`))
					Settings.editSetting(guild, setting, settingvalue)
				}
				}
			);
		} catch (error) {
			log(error, logType.critcal)

		}
	}

	static removeGuild(guild) {
		Config[guild.id] = null;
    delete Config[guild.id];
	}

	static getValue(guild, setting) {
		try {
		return eval(`Config[guild.id].${setting}`);
	} catch (err) {
		if (err) log("Error occured whilst grabbing guild " + guild.id + " for setting " + setting + ".", logType.critical)
	}
	}

	static editSetting(guild, setting, value) {
		console.log("Called on " + setting + " with value " + value)
		if (value == true || value == false) {
			eval(`Config[guild.id].${setting} = ${value}`)
		} else {
		eval(`Config[guild.id].${setting} = "${value}"`)
	}
	}

	static saveConfig() {
		log("Saving settings...", logType.info);
    var contents = JSON.stringify(Config, null, 4);
    //Write to secondary file first
    fs.writeFile("./data/main/settings/settings.prewrite.json", contents, "utf8", function(error) {
        if (error) {
            log("Settings couldn't be saved", logType.critical);
        } else {
            fs.writeFile("./data/main/settings/Settings.json", contents, "utf8", function(error) {
                if (error) {
                    log("Settings couldn't be saved, but the prewrite settings were saved successfully.", logType.critical);
                } else {
                    fs.unlinkSync("./data/main/settings/settings.prewrite.json");
                    log("Settings saved!", logType.good);
                }
            });
        }
    });
	}

}

module.exports = Settings;
