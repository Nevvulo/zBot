const Settings = require("./../../../structures/general/Settings.js")
const Guild = require("./../../../models/guild/Guild.js")
const Discord = require("discord.js")

module.exports = async function nickname(oldMember, newMember) {  
    const client = oldMember.guild.client
    if (oldMember.user.bot) return;

    let moderator = oldMember;
    if (newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
      let auditLog = await oldMember.guild.fetchAuditLogs({limit: 1})
      if (auditLog) {
        auditLog = auditLog.entries.array()[0];
        moderator = auditLog.executor;
      }
    }

    if (newMember.nickname != oldMember.nickname) {
        //Grab the channels
        const channels = await Settings.grabLoggingChannels(oldMember.guild, "moderation", "member_update");
        if (!channels) return;

        const embed = new Discord.MessageEmbed();
        embed.setAuthor("Nickname Change »  " + oldMember.user.tag, oldMember.user.displayAvatarURL());
        embed.setColor("#42b3f4");
        if (newMember.nickname != null) {
          embed.setDescription(":label: " + (moderator.id !== oldMember.id ? "<@" + moderator.id + ">" + " changed " + "<@" + oldMember.id + ">'s nickname." : "<@" + oldMember.id + "> has changed their nickname."));
        } else {
          embed.setDescription(":label: " + (moderator.id !== oldMember.id ? "<@" + moderator.id + ">" + " cleared " + "<@" + oldMember.id + ">'s nickname." : "<@" + oldMember.id + "> has cleared their nickname.") + "\nIt has defaulted to their username.\n");
        }
        embed.addField("Previous Nickname", oldMember.displayName);
        embed.addField("New Nickname", newMember.displayName);
        embed.setTimestamp(new Date());

        //Send the log to all the channel(s)
        for (let i in channels) {
          if (await Settings.checkIgnore(oldMember.guild, channels[i], "logs")) continue;
          if (!oldMember.guild.channels.has(channels[i])) continue;
          oldMember.guild.channels.get(channels[i]).send({ embed });
        }
        return;
    }
}