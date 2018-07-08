const Punish = require("./../../../structures/moderation/Punish.js")
const Settings = require("./../../../structures/general/Settings.js")
const Discord = require("discord.js");
const moment = require("moment")

module.exports = async function moderationlog(guildMember) {  
  //Grab the channels
  const channelsMod = await Settings.grabLoggingChannels(guildMember.guild, "moderation", "member_leave");

  async function leave() {
    const embed = new Discord.MessageEmbed();
    embed.setAuthor("Member Left »  " + guildMember.user.tag, guildMember.user.displayAvatarURL());
    embed.setColor("#f44336");
    embed.setDescription(":wave: <@" + guildMember.id + "> has left " + guildMember.guild.name + ".\n");
    let msg = 0;
    if (guildMember.joinedAt) {
    msg = moment(`${guildMember.joinedAt.toLocaleDateString()} ${guildMember.joinedAt.toLocaleTimeString()}`, "YYYY-MM-DD h:mm:ss a").format("Do [of] MMMM, YYYY [at] h:mm:ss a") + " (" + moment(`${guildMember.joinedAt.toLocaleDateString()} ${guildMember.joinedAt.toLocaleTimeString()}`).fromNow() + ")";
    if (msg === "Invalid date") { msg = `${guildMember.joinedAt.toLocaleDateString()} at ${guildMember.joinedAt.toLocaleTimeString()}`};
    }
    embed.addField("User Joined", msg || "Unknown");
    embed.setTimestamp(new Date());

    //Send the log to all the channel(s)
    for (let i in channelsMod) {
      if (await Settings.checkIgnore(guildMember.guild, channelsMod[i], "logs")) continue;
      if (!guildMember.guild.channels.has(channelsMod[i])) continue;
      guildMember.guild.channels.get(channelsMod[i]).send({ embed });
    }

    Settings.removeMember(guildMember.guild, guildMember)
    return embed;
  }
}