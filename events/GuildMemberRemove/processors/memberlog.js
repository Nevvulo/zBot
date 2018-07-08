const Settings = require("./../../../structures/general/Settings.js")
const Discord = require("discord.js");

module.exports = async function memberlog(guildMember) {
    //Grab the channels
    const channelsMember = await Settings.grabLoggingChannels(guildMember.guild, "member", "leave");
    if (channelsMember) performLeaveMessage();

    async function performLeaveMessage() {
      let randomleave = "";
      switch (Math.floor(Math.random() * 1000) % 4) {
        case 0:
          randomleave = "See you later!";
          break;
        case 1:
          randomleave = "Goodbye!";
          break;
        case 2:
          randomleave = "Bye!";
          break;
        case 3:
          randomleave = "Hope to see you again!";
          break;
      }

      let msg = "";
      if (!await Settings.getValue(guildMember.guild, "leaveMessage")) {
        msg = "**" + guildMember + "** has left the server. *" + randomleave + "*";
      } else {
        let leaveMessage = await Settings.getValue(guildMember.guild, "leaveMessage")
        if (!leaveMessage) return;
        let translate = {
          "%{user}": guildMember,
          "%{username}": guildMember.user.username,
          "%{tag}": guildMember.user.tag,
          "%{displayname}": guildMember.user.displayName,
          "%{discriminator}": guildMember.user.discriminator,
          "%{userid}": guildMember.id,
          "%{avatar}": guildMember.user.displayAvatarURL()
        };
        for (let key in translate) {
            leaveMessage = leaveMessage.replace(new RegExp(key, "ig"), translate[key]);
        }
        msg = "​" + leaveMessage.toString();
      }

      //Send the log to all the channel(s)
      for (let i in channelsMember) {
        if (await Settings.checkIgnore(guildMember.guild, channelsMember[i], "logs")) continue;
        if (!guildMember.guild.channels.has(channelsMember[i])) continue;
        guildMember.guild.channels.get(channelsMember[i]).send({ msg });
      }
  }
}