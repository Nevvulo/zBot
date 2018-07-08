const { Structures } = require("discord.js");
const Settings = require("./../structures/general/Settings.js");
const Interface = new(require("./../structures/internal/Interface.js").Interface)();

module.exports = Structures.extend("TextChannel", DiscordTextChannel => {
  return class zBotTextChannel extends DiscordTextChannel {

    constructor(...args) {
      super(...args);
    }

    zend(content, options) {
      let newContent;
      if (content.embed) newContent = (!this.guild.me.hasPermission("EMBED_LINKS") ? Interface.unembedify(content.embed) : content )
      return this.send(newContent || content, options);
    }

}
});
