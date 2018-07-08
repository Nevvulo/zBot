const Settings = require("./../structures/general/Settings.js")
const colors = require("colors")

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    const client = this.client;
    client.util.log(colors.bold(colors.green("A new guild was added!")) + colors.blue(" (ID ▪ " + guild.id + ")"));
    client.util.log(colors.bold(colors.green("zBot is now at " + colors.yellow(require("./../bot.js").broadcastEval("client.guilds.size").join()) + " guilds!")))
    await Settings.newGuild(guild);
  }
};
