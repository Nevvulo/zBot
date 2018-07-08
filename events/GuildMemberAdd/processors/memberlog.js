const Settings = require("./../../../structures/general/Settings.js")
const Discord = require("discord.js");

module.exports = async function memberlog(guildMember) {
    //Grab the channels
    const channelsMember = await Settings.grabLoggingChannels(guildMember.guild, "member", "join");
    if (channelsMember) performJoinMessage(channelsMember);

    async function performJoinMessage(channels) {
      let randomjoin = "";
      switch (Math.floor(Math.random() * 1000) % 7) {
        case 0:
          randomjoin = "Please give them a warm welcome!";
          break;
        case 1:
          randomjoin = "Thanks for joining, and we hope you enjoy your stay!";
          break;
        case 2:
          randomjoin = "Thanks for joining us!";
          break;
        case 3:
          randomjoin = "It's great to have you here!";
          break;
        case 4:
          randomjoin = "It's a pleasure to have you here.";
          break;
        case 5:
          randomjoin = "Hope you have had a great day so far!";
          break;
        case 6:
          randomjoin = "Nice to see you!";
          break;
    }

      let msg = "";
      if (!await Settings.getValue(guildMember.guild, "joinMessage")) {
        msg = "**" + guildMember + "** has joined our awesome server! *" + randomjoin + "*";
      } else {
        let joinMessage = await Settings.getValue(guildMember.guild, "joinMessage")
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
            joinMessage = joinMessage.replace(new RegExp(key, "ig"), translate[key]);
        }
        msg = "​" + joinMessage.toString();
      }

      //Send the log to all the channel(s)
      for (let i in channels) {
        if (await Settings.checkIgnore(guildMember.guild, channels[i], "logs")) continue;
        if (!guildMember.guild.channels.has(channels[i])) continue;
        guildMember.guild.channels.get(channels[i]).send({ msg });
      }
    }
}