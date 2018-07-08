const Settings = require("./../structures/general/Settings.js")
const Guild = require("./../models/guild/Guild.js")
const Discord = require("discord.js")
const Expletive = require("./../structures/moderation/Filter.js").Expletive

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(oldMessage, newMessage) {
    const client = this.client
    if (!oldMessage.guild) return;
    if (oldMessage.cleanContent == newMessage.cleanContent) return; //Ignore
    if (oldMessage.author.bot) return;

    client.messages.edited++

    new Expletive(this.client).run(newMessage) //Filter
    //Grab the channels
    const channels = await Settings.grabLoggingChannels(oldMessage.guild, "message", "edit");
    if (!channels) return;
    if (await Settings.checkIgnore(oldMessage.guild, oldMessage.channel, "ignoreLogs")) return;

    const embed = new Discord.MessageEmbed();
      embed.setAuthor("Message Edited »  " + oldMessage.author.tag, (oldMessage.author.displayAvatarURL().toString().endsWith(".gif") ? oldMessage.author.displayAvatarURL() : oldMessage.author.displayAvatarURL({size: 2048})));
      embed.setColor("#f4c242");
      embed.setDescription(client.util.emoji("edit", oldMessage.guild) + " Message by <@" + oldMessage.author.id + "> in <#" + oldMessage.channel.id + "> was edited.\n")
      let msg = "";
      if (oldMessage.cleanContent.length > 1020) {
        msg = oldMessage.cleanContent.substr(0, 1019) + "...";
      } else if (oldMessage.cleanContent.length < 1) {
        msg = "*No message provided*.";
      } else {
        msg = oldMessage.cleanContent;
      }
      if (oldMessage.attachments.size > 0) {
        let files = oldMessage.attachments.map(a => a.attachment)
        msg += " " + files.toString()
      }

      embed.addField("**Previous Content**", msg);

      msg = "";
      if (newMessage.cleanContent.length > 1020) {
        msg = newMessage.cleanContent.substr(0, 1019) + "...";
      } else if (newMessage.cleanContent.length < 1) {
        msg = "*No message provided*.";
      } else {
        msg = newMessage.cleanContent;
      }
      if (newMessage.attachments.size > 0) {
        let files = newMessage.attachments.map(a => a.attachment)
        msg += " " + files.toString()
      }
      embed.addField("**Updated Content**", msg);
      embed.setTimestamp(new Date());

      //Send the log to all the channel(s)
      for (let i in channels) {
        if (!oldMessage.guild.channels.has(channels[i])) continue;
        oldMessage.guild.channels.get(channels[i]).send({ embed });
      }
};
}
