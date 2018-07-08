const Settings = require("./../structures/general/Settings.js")
const Punish = require("./../structures/moderation/Punish.js")
const Discord = require("discord.js")

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild, user) {
    let executor = this.client.user
    let reason = "*No reason supplied*."
    if (guild.me.hasPermission("VIEW_AUDIT_LOG")) {
      let auditLog = await guild.fetchAuditLogs({limit: 1})
      if (auditLog) {
        auditLog = auditLog.entries.array()[0];
        executor = auditLog.executor;
        reason = auditLog.reason;
      }
    }

    await Punish.performPunish(guild, "ban", executor, user, reason, null)
  }
};
