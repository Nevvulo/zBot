const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const SettingsModel = require('./../../models/general/Settings.js')
const { GuildLogObject, GuildConfiguration, GuildStructure } = require('./../../util/Constants.js')
const Find = require('./../internal/Find.js') //try and get Find.channel working again and post to general
const User = require('./../../models/user/User.js')
const Moderation = require('./../../models/general/Moderation.js')
const Tags = require('./../../models/general/Tags.js')
const GuildModel = require('./../../models/guild/Guild.js');
let developerOverrides = true;
const GuildSettingsStore = new Map();

class Settings {
    static get settings() {
        return GuildConfiguration;
    }

    static get guildinit() {
        return GuildStructure;
    }

    static async storeGuildConfigurations() {
        const guildObj = await SettingsModel.findAll();
        for (let i in guildObj) {
          if (!GuildSettingsStore.get(guildObj[i].dataValues.guildID)) GuildSettingsStore.set(guildObj[i].dataValues.guildID, new Map());
          Object.entries(guildObj[i].dataValues).forEach(
      			([key, value]) => {
            GuildSettingsStore.get(guildObj[i].dataValues.guildID).set(key, value)
          });
        }
    }

    static async newGuild(guild) {
        const client = require('./../../bot.js').eval(0, "client");
        const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
        const guildObj = await GuildModel.findOne({ where: { id: guild.id } });
        if (!guildSettings && !guildObj) {
            SettingsModel.create(Object.assign({ guildID: guild.id }, Settings.settings));
            GuildModel.create(Object.assign({ id: guild.id }, Settings.guildinit));
            var msg = ":wave: **Hey!** Thanks for inviting me to your server! I'm *zBot*, and I am an 'all-in-one' bot created by `" + (!client.developer ?
                "nobody" : client.developer.tag) + "`. I feature moderation tools, entertainment, customizable profiles and lots more!\n"
            msg += client.util.emoji("info", guild) + "*To get started using zBot, type `+help` to see what you can do!*\n"
            msg +=
                "\n\nIf you ever need any help, don't hesitate to join our support server; <https://discord.gg/uQWCfXB/>. You can also find the zBot website at `https://zbot.me/`.\n**Thanks for using zBot, and have fun! :thumbsup:**"
            const channel = Find.channel("general", guild)[0] || Find.channel("lobby", guild)[0] || Find.channel("hub", guild)[0] || Find.channel("bot", guild)[0] || Find.channel("testing", guild)[0]
            if (!channel) {
                if (!guild.owner) guild.owner = guild.members.get(this.ownerID) || null
                return guild.owner.send(msg);
            } else {
                return channel.send(msg).catch(err => {
                    if (!guild.owner) guild.owner = guild.members.get(this.ownerID) || null
                    return guild.owner.send(msg).catch(function(err) {});
                })
            }
        } else {
            client.util.log("This guild was not added to the database because it already exists.", "warn");
            return;
        }
    }

    static async fixGuild(guild) {
        const client = require('./../../bot.js').eval(0, "client");
        await GuildModel.destroy({ where: { id: guild.id } });
        client.util.log(guild.name + " (" + guild.id + ") already exists in the database, but we're going to attempt to fix it.", "warn");
        return await GuildModel.create(Object.assign({ id: guild.id }, Settings.guildinit));
    }
    
    static getSettingType(setting) {
        const value = Settings.settings[setting]
        if (value == undefined) throw new Error("Invalid setting provided")
        if (value.constructor === Boolean) return Boolean;
        if (value.constructor === Number) return Number;
        if (value.constructor === Number && setting.toLowerCase().includes("channel")) return "Channel";
        if ((value.constructor === Number || value.constructor === String) && setting.toLowerCase().includes("role")) return "Role";
        if ((value.constructor === String) && setting == "prefix") return "Prefix";
        return String;
    }

    static async getAllSettings(guild) {
        const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
        if (guild == "") return Settings.settings
        return guildSettings.dataValues;
    }

    static async checkGuild(guild) {
        const client = require('./../../bot.js').eval(0, "client");
        const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
        if (guildSettings == null) {
            client.util.log(colors.bold("Guild successfully vacuumed ▪ " + guild.name) + " (" + guild.id + ")", "success")
            await Settings.newGuild(guild)
        }
    }

    static async checkGuildSettings(guild) {
        const client = require('./../../bot.js').eval(0, "client");
        const guildSettings = await SettingsModel.findOne({ where: { guildID: guild.id } });
        var configSettingsList = Settings.settings;
        try {
            for (const [key, value] of Object.entries(configSettingsList)) {
                const setting = key;
                const settingvalue = value;
                if (guildSettings[setting] == null) {
                    await Settings.editSetting(guild, setting, settingvalue)
                    client.util.log(colors.bold("Guild setting successfully vacuumed ▪ " + setting + " in " + guild.name) + " (" + guild.id + ")", "success")
                }
            }
        } catch (error) {
            client.util.log(error, "critical")
        }
    }
    
    static async removeGuild(guild) {
        //add code here to mark for deletion instead of deleting straight away
        await GuildModel.destroy({ where: { id: guild.id } });
        await SettingsModel.destroy({ where: { guildID: guild.id } });
        await User.destroy({ where: { guildID: guild.id } });
        await Moderation.destroy({ where: { guildID: guild.id } });
        await Tags.destroy({ where: { guildID: guild.id } });
    }

    static async removeMember(guild, user) {
        await User.destroy({ where: { guildID: guild.id, userID: user.id } }); //slots and badges are now merged into the user object
    }

    static async getValue(guild, setting) {
        const client = require('./../../bot.js').eval(0, "client");
        if (!guild) throw "Guild is invalid";
        if (!GuildSettingsStore.get(guild.id)) GuildSettingsStore.set(guild.id, new Map());
        let store = GuildSettingsStore.get(guild.id).get(setting);
        if (!store) {
          let value = await SettingsModel.findOne({ where: { guildID: guild.id } });
          value = value.dataValues[setting]
          GuildSettingsStore.get(guild.id).set(setting, value)
          store = GuildSettingsStore.get(guild.id).get(setting);
        }
        const guildSettings = store;
        try {
            return guildSettings
        } catch (err) {
            client.util.log("Error occured whilst grabbing guild " + guild.id + " for setting " + setting + ". " + err, "critical")
        }
    }

    static async editSetting(guild, setting, value) {
        GuildSettingsStore.get(guild.id).set(setting, value);
        await SettingsModel.update({
            [setting]: value }, { where: { guildID: guild.id } })
    }

    static async toggleDeveloperOverride() {
        developerOverrides = !Settings.doesDeveloperOverride();
    }

    static async doesDeveloperOverride() {
        return developerOverrides;
    }

    static async checkIgnore(guild, channel = 0, ignoreType) {
        let isIgnored = false;
        const guildObj = await guild.config;
        guildObj.get("ignore").modules.map((ignore, i) => {
            if (ignore && (ignore.module == ignoreType || ignore.module == "everything") && (ignore.channelID == "0" || !ignore.channelID ? ignore.guildID ==
                    guild.id : ignore.channelID == channel.id)) isIgnored = true;
        });
        if (isIgnored) { return true; } else { return false; }
    }

    static async checkDisable(guild, channel = 0, disableType) {
        let isDisabled = false;
        const guildObj = await guild.config;
        guildObj.get("disable").commands.map((disable, i) => {
            if (disable && disable.command == disableType && (disable.channelID == "0" || !disable.channelID ? disable.guildID == guild.id :
                    disable.channelID == channel.id)) isDisabled = true;
        });
        if (isDisabled) { return true; } else { return false; }
    }

    static async grabLoggingChannels(guild, category, type) {
        const guildObj = await guild.config;
        return guildObj.get("logs")[category].modules[type].channels;
    }
}

module.exports = Settings;
