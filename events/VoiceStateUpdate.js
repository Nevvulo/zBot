const Settings = require("./../structures/general/Settings.js")
const Guild = require("./../models/guild/Guild.js")
const Discord = require("discord.js")

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(oldMember, newMember) {
    /*
    This code is for voice movement logging
    */

    //Grab the channels
    const channels = await Settings.grabLoggingChannels(oldMember.guild, "moderation", "voice");
    if (!channels) return;
    if (await Settings.checkIgnore(oldMember.guild, oldMember.channel, "logs")) return;

    //Create the embed
    const embed = new Discord.MessageEmbed();
    embed.setAuthor("Voice Movement »  " + oldMember.user.tag, oldMember.user.displayAvatarURL());
    embed.setColor("#616161");
    let msg = "";
    //Check if the member is still in a voice channel; this means they moved voice channels
    if (newMember.voiceChannel === oldMember.voiceChannel) return; //make sure its not the same channel
    if (oldMember.voiceChannel && newMember.voiceChannel) { msg = `${oldMember} moved from \`${oldMember.voiceChannel.name}\` to \`${newMember.voiceChannel.name}\`.`; embed.setColor("#616161"); }
    //Check if oldMember voice channel is not present but new one is; this means they joined a new channel
    if (!oldMember.voiceChannel && newMember.voiceChannel) { msg = `${oldMember} connected to \`${newMember.voiceChannel.name}\`.`; embed.setColor("#a5d6a7"); }
    //Check if oldMember voice channel is present, but new one isn't; this means they leave voice
    if (oldMember.voiceChannel && !newMember.voiceChannel) { msg = `${oldMember} disconnected from \`${oldMember.voiceChannel.name}\`.`; embed.setColor("#ef9a9a"); }
    embed.setDescription(this.client.util.emoji("info", oldMember.guild) + " " + msg)
    const current = (!oldMember.voiceChannel ? newMember.voiceChannel : oldMember.voiceChannel)
    embed.setFooter(current.members.size + " members in " + current.name)
    embed.setTimestamp(new Date());

    //Send the log to all the channel(s)
    for (let i in channels) {
      if (!oldMember.guild.channels.has(channels[i])) continue;
      oldMember.guild.channels.get(channels[i]).send({ embed });
    }

    /*
    This code is for removing players after a certain interval
    */

    //we plus 1 on the length because in the filter, we are filtering out the bot
    if (!oldMember.voiceChannel) return;
    if (!oldMember.guild.music.player) return;
    const player = oldMember.guild.music.player;
    if (oldMember.voiceChannel.members.filter(a => !a.user.bot).array().length < 1 && player.playing && oldMember.voiceChannel.id === player.channel) {
      const prefix = await oldMember.guild.prefix
      oldMember.guild.music.repeat.single = false;
      oldMember.guild.music.repeat.queue = false;
      oldMember.guild.music.pause()
      oldMember.guild.music.textChannel.send(this.client.util.emoji("info", oldMember.guild) + " **MUSIC**: There's nobody in `" + oldMember.voiceChannel.name + "` (not including bots), so I've paused the music. You can use `" + prefix + "resume` to resume the music again.");
      this.client.setTimeout(() => this.destroy(oldMember.guild), 6e4)
      return;
    }
  }

  async destroy(guild) {
    const player = await this.client.lavalink.get(guild.id);
    if (!guild.music.voiceChannel) return;
    if (guild.channels.get(player.channel).members.filter(a => !a.user.bot).array().length < 1 && guild.music.paused) {
        this.client.util.log(`Music ended in ${guild.name} via the automatic dispatcher ender 2.0`)
        guild.music.textChannel.send(this.client.util.emoji("empty", guild) + " **MUSIC**: Left voice channel due to inactivity.")
        guild.music.repeat.single = false;
        guild.music.repeat.queue = false;
        guild.music.destroy();
        return;
    }
  }
};
