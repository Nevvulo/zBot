const Settings = require("./../../../structures/general/Settings.js")
const Punish = require("./../../../structures/moderation/Punish.js")

module.exports = async function punishment(guildMember) {
    let client = guildMember.guild.client
    let executor = client.user
    let reason = "*No reason supplied*."
    if (guildMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
      let auditLog = await guildMember.guild.fetchAuditLogs({limit: 1})
      if (auditLog) {
        auditLog = auditLog.entries.array()[0];
        executor = auditLog.executor;
        reason = auditLog.reason;

        if (auditLog.action === "MEMBER_KICK" && auditLog.target.id === guildMember.id) {
          //kick
          await Punish.performPunish(guildMember.guild, "kick", executor, guildMember, reason, null)
        }
      }
    }

    const channelsMod = await Settings.grabLoggingChannels(guildMember.guild, "moderation", "member_leave");

    let recentCase = await Punish.grabCases(guildMember.guild);
    let recentCaseObj = await Punish.getCase(recentCase, guildMember.guild)
    if (recentCaseObj) {  
      if ((recentCaseObj.type == "ban" || recentCaseObj.type == "softban" || recentCaseObj.type == "kick") && recentCaseObj.userID == guildMember.id) {
        if (channelsMod) {
          let type = recentCaseObj.type + "ed";
          if (recentCaseObj.type.includes("ban")) {
            type = recentCaseObj.type + "ned"
          }
          performPunishLeave(type);
        }
      }
    }

    async function performPunishLeave(type) {
      const embed = new Discord.MessageEmbed();
      embed.setAuthor("Member Removed »  " + guildMember.user.tag, guildMember.user.displayAvatarURL());
      embed.setColor("#f44336");
      embed.setDescription(":wave: <@" + guildMember.id + "> was " + type + " from " + guildMember.guild.name +
      (guildMember.guild.members.get(recentCaseObj.punishedBy) ? " by <@" + recentCaseObj.punishedBy + ">.\n" : "."));
      embed.addField("Reason", recentCaseObj.reason);
      embed.setTimestamp(new Date());

      //Send the log to all the channel(s)
      for (let i in channelsMod) {
        if (await Settings.checkIgnore(guildMember.guild, channelsMod[i], "logs")) continue;
        if (!guildMember.guild.channels.has(channelsMod[i])) continue;
        guildMember.guild.channels.get(channelsMod[i]).send({ embed });
      }

      Settings.removeMember(guildMember.guild, guildMember)
      return;
    }

}