const Settings = require("./../../../structures/general/Settings.js")
const Discord = require("discord.js");
const moment = require("moment")

module.exports = async function moderationlog(guildMember) {
    const channelsMod = await Settings.grabLoggingChannels(guildMember.guild, "moderation", "member_join");
    if (channelsMod) {
      const embed = new Discord.MessageEmbed();
      embed.setAuthor("Member Joined »  " + guildMember.user.tag, (guildMember.user.displayAvatarURL().toString().endsWith(".gif") ? guildMember.user.displayAvatarURL() : guildMember.user.displayAvatarURL({size: 2048})));
      embed.setColor("#39cc45");
      embed.setDescription(":wave: <@" + guildMember.id + "> has joined " + guildMember.guild.name + ".\n");
      let msg = moment(`${guildMember.user.createdAt.toLocaleDateString()} ${guildMember.user.createdAt.toLocaleTimeString()}`, "YYYY-MM-DD h:mm:ss a").format("Do [of] MMMM, YYYY [at] h:mm:ss a") + " (" + moment(`${guildMember.user.createdAt.toLocaleDateString()} ${guildMember.user.createdAt.toLocaleTimeString()}`).fromNow() + ")";
      embed.addField("**User Created**", msg);
      embed.setFooter("For more information on this user, type " + await Settings.getValue(guildMember.guild, "prefix") + "uinfo " + guildMember.user.username + ".");

      //Send the log to all the channel(s)
      for (let i in channelsMod) {
        if (await Settings.checkIgnore(guildMember.guild, channelsMod[i], "logs")) continue;
        if (!guildMember.guild.channels.has(channelsMod[i])) continue;
        guildMember.guild.channels.get(channelsMod[i]).send({ embed });
      }
    }

}