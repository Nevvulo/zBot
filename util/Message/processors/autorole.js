const cooldowns = new Map();
const Settings = require('./../../../structures/general/Settings.js');
const Experience = require('./../../../structures/user/Experience.js')

module.exports = async function autorole(message, guild) {
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

//AUTOROLE MANAGER
const Experience = require('./../../../structures/user/Experience.js')
let userLevel = await Experience.getLevel(message.author.id, message.guild.id)
if (guild.autoroles.roles.length && !timestamps.has(message.author.id)) autorole();

function autorole() {
  if (!guild.autoroles.roles) return;
  guild.autoroles.roles.map((level, i) => {
    let autoroleObject = guild.autoroles.roles[i]
    if (!autoroleObject.onJoin) {
        if (autoroleObject.level !== userLevel && (autoroleObject.removeOnLevelChange == null ? false : autoroleObject.removeOnLevelChange) == true) {
        if (message.guild.roles.has(autoroleObject.role.id) && !message.member.roles.has(autoroleObject.role.id)) {
          this.client.util.log(`[LEVEL] Removing autorole ${autoroleObject.role.name} (${autoroleObject.role.id}) (level ${autoroleObject.level} - user level is ${userLevel}) in ${message.guild.name} (${message.guild.id})`, "success")
          message.member.roles.remove(autoroleObject.role.id);
        }
      }
    }

    if (autoroleObject.level <= userLevel) {
      if (autoroleObject.removeOnLevelChange == null) autoroleObject.removeOnLevelChange = false;
      if (message.guild.roles.has(autoroleObject.role.id) && !message.member.roles.has(autoroleObject.role.id)) {
        this.client.util.log(`[LEVEL] Adding autorole ${autoroleObject.role.name} (${autoroleObject.role.id}) (level ${autoroleObject.level} - user level is ${userLevel}) in ${message.guild.name} (${message.guild.id})`, "success")
        message.member.roles.add(autoroleObject.role.id);
      }
    }
  });
}

};