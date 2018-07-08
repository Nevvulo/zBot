const Settings = require("./../structures/general/Settings.js")
const Guild = require("./../models/guild/Guild.js")
const Discord = require("discord.js")

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    const client = this.client
    if (!message.guild) return;
    if (`${Date.now() - message.createdTimestamp}` < 1000) return;
    if (message.content.startsWith(await message.guild.prefix)) return;
    if (message.author.bot) return;

    client.messages.deleted++

    const channels = await Settings.grabLoggingChannels(message.guild, "message", "delete");
    if (!channels) return;
    if (await Settings.checkIgnore(message.guild, message.channel, "logs")) return;

    const embed = new Discord.MessageEmbed();
    embed.setAuthor("Message Deleted »  " + message.author.tag, message.author.displayAvatarURL());
    embed.setColor("#e08743");
    embed.setDescription(client.util.emoji("bin", message.guild) + " Message by <@" + message.author.id + "> in <#" + message.channel.id + "> was removed.\n");
    let msg = "*No message provided*.";
    msg = message.cleanContent;
    if (message.cleanContent.length > 1020) msg = message.cleanContent.substr(0, 1019) + "...";
    if (message.cleanContent.length < 1) msg = "*No message provided*.";
    if (message.attachments.size > 0) msg += " " + message.attachments.map(a => a.attachment).toString();
    embed.addField("**Message**", msg);
    embed.setTimestamp(new Date());

    //Send the log to all the channel(s)
    for (let i in channels) {
      if (!message.guild.channels.has(channels[i])) continue;
      message.guild.channels.get(channels[i]).send({ embed });
    }
  }
};
