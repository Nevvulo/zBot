const cooldowns = new Map();

module.exports = async function afk(message) {
    //COOLDOWN SYSTEM
    if (!cooldowns.has(message.guild.id)) cooldowns.set(message.guild.id, new Map());
    const now = Date.now();
    const timestamps = cooldowns.get(message.guild.id);
    const cooldownAmount = 30000;
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) return;
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    //END COOLDOWN

    if (message.mentions.members.first()) {
        const user = (await message.mentions.members.first().profile).get("afk")
        if (message.author.id == message.mentions.members.first().id) return;
        if (user.afk) message.zreply(this.client.util.emoji("info", message.guild) + " **AFK**: " + message.mentions.members.first()
        .username + " has marked themselves as AFK" + (user.reason ? " with the reason `" + user.reason + "`." : "."))
    }
  };