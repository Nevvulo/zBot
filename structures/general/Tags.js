const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const Settings = require('./Settings.js');
const Find = require('./../internal/Find.js');
const Experience = require('./../user/Experience.js');

class Tags {
  static async autoresponseVariables(message, raw) {
  var obj = {
      "%{user}": message.author,
      "%{username}": message.author.username,
      "%{tag}": message.author.tag,
      "%{displayname}": message.member.displayName,
      "%{discriminator}": message.author.discriminator,
      "%{userid}": message.author.id,
      "%{avatar}": message.author.displayAvatarURL(),
      "%{bot}": message.author.bot,
      "%{totalexp}": await message.member.experience,
      "%{currentexp}": await Experience.getCurrentExperience(message.member),
      "%{level}": await Experience.getLevel(message.author.id, message.guild.id),
      "%{remainingexp}": Experience.getLevelBounds(await Experience.getLevel(message.member)).upperBound - Experience.getLevelBounds(await Experience.getLevel(message.member)).lowerBound,
      "%{text}": message.content
  };
  if (raw.match(/(%{random:.+?})/gi)) {
     Tags.createRandom(raw)
  }
  return obj;
}

  static createRandom(raw) {
    let dataArray = raw.split(/([^%{|}]+)/gi).slice(1) //random:ha yes|ha no
    if (dataArray[0].startsWith("random:")) dataArray[0] = dataArray[0].replace("random:", "")
    for (let i in dataArray) {
      if (i%2) dataArray.splice(i);
      if (dataArray.indexOf("{")) dataArray.splice(i, -1)
    }
    return raw.replace(/(%{random:.+?})/gi, dataArray[Math.floor(Math.random()*dataArray.length)])
  }


  static async cleanString(string, message) {
    if (await Settings.getValue(message.guild, "allowMentions")) return string;
    if (!string) return string;
    return string
    .replace(/@(everyone|here)/g, '@\u200b$1')
    .replace(/<@!?[0-9]+>/g, input => {
      const id = input.replace(/<|!|>|@/g, '');
      if (message.channel.type === 'dm' || message.channel.type === 'group') {
        return client.users.has(id) ? `@${client.users.get(id).username}` : input;
      }

      const member = message.channel.guild.members.get(id);
      if (member) {
        if (member.nickname) return `@${member.nickname}`;
        return `@${member.user.username}`;
      } else {
        const user = client.users.get(id);
        if (user) return `@${user.username}`;
        return input;
      }
    })
    .replace(/<#[0-9]+>/g, input => {
      const channel = client.channels.get(input.replace(/<|#|>/g, ''));
      if (channel) return `#${channel.name}`;
      return input;
    })
    .replace(/<@&[0-9]+>/g, input => {
      if (message.channel.type === 'dm' || message.channel.type === 'group') return input;
      const role = message.guild.roles.get(input.replace(/<|@|>|&/g, ''));
      if (role) return `@${role.name}`;
      return input;
    });
  }
}

module.exports = Tags;
