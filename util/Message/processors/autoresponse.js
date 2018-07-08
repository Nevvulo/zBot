const cooldowns = new Map();

module.exports = async function autoresponse(message, guild) {
    const client = message.guild.client;
    //COOLDOWN SYSTEM
    if (!cooldowns.has(message.guild.id)) cooldowns.set(message.guild.id, new Map());
    const now = Date.now();
    const timestamps = cooldowns.get(message.guild.id);
    const cooldownAmount = 2100;
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) return;
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    //END COOLDOWN

    if (guild && guild.autoresponses) {
        for (let i in guild.autoresponses.responses) {
            if (guild.autoresponses.responses[i].trigger === message.content) {
                const Tags = require("./../../../structures/general/Tags.js")
                const variables = await Tags.autoresponseVariables(message, guild.autoresponses.responses[i].response)
                function translate(txt) {
                    for (let key in variables) {
                    txt = txt.replace(new RegExp(key, "ig"), variables[key]);
                }
                return (txt.charAt(0) === txt.charAt(0).toUpperCase() ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt.charAt(0) + txt.slice(1))
                }
                this.client.util.log(`[AUTORESPONSE] Reacting to autoresponse trigger ${guild.autoresponses.responses[i].trigger} in ${message.guild.name} (${message.guild.id})`, "success")
                message.channel.zend(await Tags.cleanString(translate(guild.autoresponses.responses[i].response.toString()), message))
                return;
            }
        }
    }

  };