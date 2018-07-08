const Settings = require('./../../structures/general/Settings.js');
const Guild = require("./../../models/guild/Guild.js")
const Discord = require("discord.js")
const colors = require('colors');
const processors = require(`${__dirname}/processors`);
const Interface = new(require("./../../structures/internal/Interface.js").Interface)();
const CommandHandler = require("./../../structures/internal/CommandHandler.js")
const Filter = require("./../../structures/moderation/Filter.js").Expletive

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
      let msg = message.content;
      if (message.author.bot) return;

      if (!message.guild) {
        this.client.util.log("[DM] " + message.content)
        new(require("./../../structures/games/Challenge.js"))(this.client).run(message);
        return;
      }

      //Ignore
      if (await Settings.checkIgnore(message.guild, message.channel, "everything")) return;

      const guild = await Guild.findOne({ where: { id: message.guild.id } });
      if (!guild) { //create a new guild if one is not present
        this.client.util.log(colors.bold(colors.green("A new guild was added!")) + colors.blue(" (ID ▪ " + message.guild.id + ")"));
        this.client.util.log(colors.bold(colors.green("zBot is now at " + colors.yellow(this.client.guilds.size) + " guilds!")))
        await Settings.fixGuild(this.client.guilds.get(message.guild.id))
      }

      for (const processor of Object.values(processors)) {
        processor.call(this, message, guild);
      }

      if (message.channel.type === 'text' && !message.channel.permissionsFor(this.client.user).has("SEND_MESSAGES")) return;
      this.client.messages.total++
      this.client.messages.characters += message.content.length

      //If not ignored, run a command.
      new CommandHandler(this.client).run(message) //CommandHandler
      new Filter(this.client).run(message) //Filter
  }
};
