const { Structures, Discord } = require("discord.js");
const Experience = require("./../structures/user/Experience.js");
const Badge = require("./../structures/user/Badges.js");
const Permissions = require("./../structures/internal/Permissions.js");
const Timer = require('./../models/general/Timer.js');
const Moderation = require('./../models/general/Moderation.js');
const User = require('./../models/user/User.js');
const UserStore = new Map();

module.exports = Structures.extend("GuildMember", DiscordGuildMember => {
  return class zBotGuildMember extends DiscordGuildMember {

    constructor(...args) {
      super(...args);
    }

    get fix() {
      return (async () => {
        let profile = (await this.profile);
        let changed = [];
        for (let i of Object.keys(this.defaultValues)) {
          try {
            if ((profile.get(i) == null || profile.get(i) == undefined || i == "inventory") && this.defaultValues[i]) {
              const assign = !profile.get(i) ? this.defaultValues[i] : Object.assign(this.defaultValues[i], profile.get(i))
              changed.push(i);
              await this.update(i, assign);
            }
          } catch (e) {
            continue;
          }
        }
      return changed;
      })();
    }

    async create() {
        const u = await User.create(Object.assign({ userID: this.id,
          username: this.user.username,
          discriminator: this.user.discriminator,
          guildID: this.guild.id }, this.defaultValues));
        return u
    }

    get profile() { //needs await
      return (async () => {
        if (!UserStore.get(this.id)) UserStore.set(this.id, new Map());
        let store = UserStore.get(this.id).get(this.guild.id)
        if (!store) {
            let user = await User.findOne({ where: { userID: this.id, guildID: this.guild.id } });
            if (!user) user = await this.create();
            let fixed = false;
            UserStore.get(this.id).set(this.guild.id, new Map());
            for (let [key, value] of Object.entries(user.dataValues)) {
              if ((value == null || value == undefined) && key !== "id" && !fixed) {
                await this.fix;
                fixed = true;
              }
              UserStore.get(this.id).get(this.guild.id).set(key, value)
            }
        }
        return UserStore.get(this.id).get(this.guild.id);
      })();
    }

    update(type, value) {
      return (async () => {
        try {
            if (!UserStore.get(this.id)) (await this.profile)
            if (!UserStore.get(this.id).get(this.guild.id)) (await this.profile)
            UserStore.get(this.id).get(this.guild.id).set(type, value);
    		    await User.update({ [type]: value }, { where: { userID: this.id, guildID: this.guild.id } });
            return value;
        } catch (err) {
            throw err;
        }
      })();
    }

    updateAll(type, value) {
      return (async () => {
        try {
            for (const member of this.guild.members.values()) {
              try {
                UserStore.get(member.id).get(this.guild.id).set(type, value);
              } catch (err) {
                continue;
              }
            }
    		    await User.update({ [type]: value }, { where: { guildID: this.guild.id } });
            return value;
        } catch (err) {
            throw err;
        }
      })();
    }

    get timers() {
       return (async () => {
          return await Timer.findAll({
            attributes: ['timerID', 'userID', 'guildID', 'timerEnd', 'reason'],
            where: { userID: this.id, guildID: this.guild.id },
            raw: true,
          });
      })();
    }

    get experience() {
      return (async () => {
       return await Experience.getTotalExperience(this);
     })();
    }

    get badges() {
      return (async () => {
       return await Badge.grabTotalBadges(this.guild, this.id);
     })();
    }

    permission(optionalPermission) {
      return (async () => {
       return await Permissions.grabPermissionLevel(this, this.guild, optionalPermission);
     })();
    }

    get moderator() {
      return (async () => {
       return await Permissions.isModerator(this, this.guild);
     })();
    }

    get developer() {
       return Permissions.isDeveloper(this);
    }

    get punishments() {
      return (async () => {
        return await Moderation.findAll({
          attributes: ['userID', 'case', 'type', 'punishedBy', 'reason'],
          where: { guildID: this.guild.id, userID: this.id },
          raw: true
        });
     })();
    }


    get defaultValues() {
      const obj = {};
      for (let i of Object.keys(User._defaultValues)) {
        if (i == "id") continue;
        obj[i] = User._defaultValues[i]();
      }
      return obj
    }
}
});
