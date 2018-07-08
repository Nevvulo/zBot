const { Structures } = require("discord.js");
const Settings = require("./../structures/general/Settings.js");
const Interface = new(require("./../structures/internal/Interface.js").Interface)();

module.exports = Structures.extend("Message", DiscordMessage => {
  return class zBotMessage extends DiscordMessage {

    constructor(...args) {
      super(...args);
    }

    zreply(content, options) {
      const newContent = content.embed ? Interface.unembedify(content.embed) : content;
      return this.reply(newContent, options);
    }
}
});
