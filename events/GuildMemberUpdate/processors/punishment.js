const Settings = require("./../../../structures/general/Settings.js")
const Punish = require("./../../../structures/moderation/Punish.js")

module.exports = async function punishment(oldMember, newMember) {
    if (oldMember.roles !== newMember.roles) {
      let executor = oldMember.guild.client.user
      let reason = "*No reason supplied*."
      if (newMember.guild.me.hasPermission("VIEW_AUDIT_LOG")) {
        let auditLog = await oldMember.guild.fetchAuditLogs({limit: 1})
        if (auditLog) {
          auditLog = auditLog.entries.array()[0];
          executor = auditLog.executor;
          reason = auditLog.reason;
        }
      }

      const muteRole = await Settings.getValue(oldMember.guild, "muteRole")
      if (!oldMember.roles.has(muteRole) && newMember.roles.has(muteRole)) {
        //muted
        await Punish.performPunish(oldMember.guild, "mute", executor, newMember, reason, null)
      }
      if (oldMember.roles.has(muteRole) && !newMember.roles.has(muteRole)) {
        //unmuted
        await Punish.performPunish(oldMember.guild, "unmute", executor, newMember, reason, null)
      }
    }
}