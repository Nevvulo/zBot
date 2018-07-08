const { Structures } = require("discord.js");
const Experience = require("./../structures/user/Experience.js");
const Stats = require("./../structures/internal/Statistics.js");
const Permissions = require("./../structures/internal/Permissions.js");
const Timer = require('./../models/general/Timer.js');
const Statistics = require('./../structures/internal/Statistics.js');

module.exports = Structures.extend("User", DiscordUser => {
  return class zBotUser extends DiscordUser {

    constructor(...args) {
      super(...args);
    }

    get developer() { return Permissions.isDeveloper(this); }

    get guilds() {
      let amount = 0;
      for (const client of require("./../bot.js").broadcastEval("client").results) {
        amount += client.guilds.filter(guild => {
          if (guild.members.has(this.id)) return guild;
        }).size;
      }
      return amount;
    }

    get upvoted() {
      const id = this.id;
      return (async () => {
        let upvoters = [];
        for (const client of require("./../bot.js").broadcastEval("client").results) {
          if (!client.upvoters) return false;
          upvoters.concat(client.upvoters)
        }
        reduce = a => [...new Set(a)];
        upvoters = reduce(upvoters)
        return (upvoters.includes(id) ? upvoters.includes(id) :
          async function() { const v = await Statistics.zBotUpvotes(); if (v.includes(id)) client.upvoters.push(id); return v.includes(id); }())
      })();
    }

    get patron() { //plus = 408590002100895744, ultra = 408589651566264332
      const client = require("./../bot.js").eval(0, "client")
      const donators = client.donators;
      const patrons = client.guilds.get('363516708062756886').members.filter(m => m.roles.has('408590204707012608'))
      const isPatron = patrons.has(this.id);
      const patronLevel = (isPatron ? (patrons.get(this.id).roles.has("408589651566264332") ? 2 : 1) : 0)
      const type = patronLevel == 1 ? "zBot+" : "zBot Ultra";
      return isPatron ? { patron: isPatron, level: patronLevel, type: type, redeemed: false, amount: donators[this.id] ? 
        donators[this.id] : (patronLevel == 1 ? 1 : 5) } : false;
    }
}
});
