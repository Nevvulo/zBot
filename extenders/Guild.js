const { Structures } = require("discord.js");
const Settings = require("./../structures/general/Settings.js");
const GuildStore = new Map();
const Guild = require('./../models/guild/Guild.js');

module.exports = Structures.extend("Guild", DiscordGuild => {
  return class zBotGuild extends DiscordGuild {

    constructor(...args) {
      super(...args);
    }

     get prefix() {
       return (async () => {
        return await Settings.getValue(this, "prefix");
      })();
    }

    async create() {
      return await Settings.fixGuild(this);
    }

    get fix() {
      return (async () => {
        let config = (await this.config);
        let changed = [];
        for (let i of Object.keys(this.defaultValues)) {
          try {
            if ((config.get(i) == null || config.get(i) == undefined)) {
              console.log("Guild fixed for " + i)
              const assign = !config.get(i) ? this.defaultValues[i] : Object.assign(this.defaultValues[i], config.get(i))
              changed.push(i);
              await this.update(i, assign); //change this so `update` isn't called on every loop
            }
          } catch (e) {
            continue;
          }
        }
      return changed;
      })();
    }

    get config() { //needs await
      return (async () => {
        let store = GuildStore.get(this.id);
        if (!store) {
            let guild = await Guild.findOne({ where: { id: this.id } });
            if (!guild) guild = await this.create();
            let fixed = false;
            GuildStore.set(this.id, new Map());
            for (let [key, value] of Object.entries(guild.dataValues)) {
              if ((value == null || value == undefined) && key !== "id" && !fixed) {
                await this.fix;
                fixed = true;
              }
              GuildStore.get(this.id).set(key, value);
            }
        }
        return GuildStore.get(this.id);
      })();
    }

    update(type, value) {
      return (async () => {
        try {
            GuildStore.get(this.id).set(type, value);
    		    await Guild.update({ [type]: value }, { where: { id: this.id } });
            return value;
        } catch (err) {
            throw err;
        }
      })();
    }

    get music() {
        return this.client.music.get(this.id) || this.client.music.add(this);
    }

    get defaultValues() {
      const obj = {};
      for (let i of Object.keys(Guild._defaultValues)) {
        if (i == "id") continue;
        obj[i] = Guild._defaultValues[i]();
      }
      return obj
    }
}
});
