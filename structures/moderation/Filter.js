const Discord = require("discord.js");
const Settings = require('./../general/Settings.js');
const Guild = require('./../../models/guild/Guild.js');

class Expletive {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        const client = this.client;
        if (message.channel.type !== 'text') return;
        if (message.author.bot) return;
        if (!await Settings.getValue(message.guild, "expletiveFilter")) return; //setting 
        if (await Settings.checkIgnore(message.guild, message.channel, "expletive")) return; //check ignore
        let msg = message.content;
        const guild = await message.guild.config;
        let filter = guild.get("filter");
        if (!filter) return;
        let words = filter.words
        if (!words) {
            words = ['fuck', 'penis', 'cunt', 'faggot', 'wank', 'nigger', 'nigga', 'slut', 'bastard', 'bitch', 'asshole', 'dick', 'blowjob', 'cock',
                'pussy', 'retard'];
            await message.guild.update("filter", filter)
        }

        let exp = -1;
        switch (filter.level) {
            case 1:
                exp = msg.search(new RegExp(words.join("|"), "i"));
                break;
            case 2:
                exp = msg.search(new RegExp("(\b|\s|^|.|\,|\ )" + words.join("|") + "(\b|\s|$|.|\,|\ )", 'i'));
                break;
            case 3:
                msg = msg.replace(new RegExp(/[^\u0030-\u26Fx]/gi, "ig"), "");
                exp = msg.search(new RegExp("(\b|\s|^|.|\,|\ )" + words + "(\b|\s|$|.|\,|\ )", 'i'));
                break;
            default:
        }
            if (exp > -1) { //Gah! They're not supposed to say that!
            message.delete().then(function() {
                message.channel.zend(client.util.emoji("nope", message.guild) + " **" + message.member.displayName +
                    "**, swear words are not permitted on this server.")
            }).catch(function() {
                return;
            });

            //Grab the channels
            const channels = await Settings.grabLoggingChannels(message.guild, "message", "expletive");
            if (!channels) return;

            const embed = new Discord.MessageEmbed();
            embed.setAuthor("Message Deleted »  " + message.author.tag, message.author.displayAvatarURL())
            embed.setColor("#ff6f00");
            embed.setDescription(client.util.emoji("bin", message.guild) + " Message by <@" + message.author.id + "> in <#" + message.channel.id +
                "> contained a blocked word.\n");
            let msg = "*No message provided*.";
            if (message.cleanContent.length > 1020) msg = message.cleanContent.substr(0, 1019) + "...";
            if (message.cleanContent.length < 1) msg = "*No message provided*.";
            msg = message.cleanContent;
            if (message.attachments.size > 0) msg += " " + message.attachments.map(a => a.attachment).toString();
            embed.addField("**Message**", msg);
            embed.setTimestamp(new Date());

            //Send the log to all the channel(s)
            for (let i in channels) {
                if (await Settings.checkIgnore(message.guild, channels[i], "logs")) continue;
                if (!message.guild.channels.has(channels[i])) continue;
                message.guild.channels.get(channels[i]).send({ embed });
            }
            return;
        }
    }
}

class Spam {
    constructor(client) {
      this.client = client;
    }
  
    async run(message) {
    const client = this.client;
    if (message.channel.type !== 'text') return;
    if (!await Settings.getValue(message.guild, "spamFilter")) return;
      if (message.author.bot) return;
      var msg = message.content
  
    if (await Settings.checkIgnore(message.guild, message.channel, "spam")) return;
  
    //Spam limiting
  
    if (!sameMessageCount.hasOwnProperty(message.guild.id) || !lastMessages.hasOwnProperty(message.guild.id)) lastMessages[message.guild.id] = {}, sameMessageCount[message.guild.id] = {};
    if (!sameMessageCount[message.guild.id].hasOwnProperty(message.author.id)) sameMessageCount[message.guild.id][message.author.id] = 0;
    if (!lastMessages[message.guild.id].hasOwnProperty(message.author.id)) lastMessages[message.guild.id][message.author.id] = {};
    if (lastMessages[message.guild.id][message.author.id] != msg) sameMessageCount[message.guild.id][message.author.id] = 0;
    lastMessages[message.guild.id][message.author.id] = msg
    sameMessageCount[message.guild.id][message.author.id] = sameMessageCount[message.guild.id][message.author.id] + 1;
    const warningThreshold = 3;
    const spamThreshold = 6;
  
        if (lastMessages[message.guild.id][message.author.id] == msg && sameMessageCount[message.guild.id][message.author.id] > spamThreshold) return message.delete();
  
        if (lastMessages[message.guild.id][message.author.id] == msg && sameMessageCount[message.guild.id][message.author.id] == spamThreshold) {
          message.delete();
          message.zreply(client.util.emoji("nope", message.guild) + " **" + message.member.displayName + "**, stop spamming! `" + (sameMessageCount[message.guild.id][message.author.id] - warningThreshold) + "/" + (spamThreshold - warningThreshold) + "`");
  
          //Grab the channels
          const channels = await Settings.grabLoggingChannels(message.guild, "message", "spam");
          if (!channels) return;
  
          const embed = new Discord.MessageEmbed();
          embed.setAuthor("Message Deleted »  " + message.author.tag, message.author.displayAvatarURL());
          embed.setColor("#e64a19");
          embed.setDescription(client.util.emoji("bin", message.guild) + " <@" + message.author.id + "> was spamming in <#" + message.channel.id + ">.\n");
          let msg = "*No message provided*.";
          if (message.cleanContent.length > 1020) msg = message.cleanContent.substr(0, 1019) + "...";
          if (message.cleanContent.length < 1) msg = "*No message provided*.";
          msg = message.cleanContent;
          if (message.attachments.size > 0) msg += " " + message.attachments.map(a => a.attachment).toString();
          embed.addField("Message", msg);
          embed.setTimestamp(new Date());
  
          //Send the log to all the channel(s)
          for (let i in channels) {
            if (await Settings.checkIgnore(message.guild, channels[i], "logs")) continue;
            if (!message.guild.channels.has(channels[i])) continue;
            message.guild.channels.get(channels[i]).send({ embed });
          }
          return;
        }
  
        if (lastMessages[message.guild.id][message.author.id] == msg && sameMessageCount[message.guild.id][message.author.id] > warningThreshold) {
          message.delete();
          return message.channel.zend(client.util.emoji("nope", message.guild) + " **" + message.member.displayName + "**, you are spamming messages with the same content too quickly! `" + (sameMessageCount[message.guild.id][message.author.id] - warningThreshold) + "/" + (spamThreshold - warningThreshold) + "`");
      }
    }
}

module.exports = { Spam, Expletive }