const Discord = require('discord.js');
const moment = require('moment')
const fs = require('fs')
const Tags = require('./../models/Tags.js');

exports.run = async (client, message, args) => {
message.delete();
let userid = message.author.id;
let guildid = message.guild.id;
var subcommand = (args[0] == undefined ? "" : args[0].toString())
const name = (args[1] == undefined ? "" : args[1].toString())
const text = args.slice(2).join(' ');

if (subcommand == "create") {
  const tagexists = await Tags.findOne({ where: { name: name, guildID: guildid } });
  if (tagexists) return message.reply(':no_entry_sign: **NOPE**: That tag already exists.');
  //TAG MANAGER
  try {
// equivalent to: INSERT INTO tags (name, descrption, username) values (?, ?, ?)
  const tag = await Tags.create({ name: name,
                                description: text,
                                userID: userid,
                                guildID: guildid });
  return message.reply(`:white_check_mark: **OK**: You've successfully created the tag **${tag.name}**.`);
} catch (e) {
throw e;
}
} else if (subcommand == "list") {
  const tagList = await Tags.findAll({ attributes: ['name', 'userID', 'guildID'] });
  const tagString = tagList.map(t => t.name).join(', ') || 'You have no tags.';
  return message.channel.send(`:white_check_mark: **OK**: Here is a list of all of the tags created **by you, on this guild**.\n*${tagString}*`);
} else if (subcommand == "remove") {
  // DELETE FROM tags WHERE name = ?
  const rowCount = await Tags.destroy({ where: { name: name, userID: message.author.id, guildID: message.guild.id } });
  if (!rowCount) return message.reply(`:no_entry_sign: **ERROR**: There's no tag with the name ${name}.`);
  return message.reply(`:white_check_mark: **OK**: Tag **${name}** was deleted.`);
} else if (subcommand == "edit") {
  // equivalent to: UPDATE tags (descrption) values (?) WHERE name="?"
const affectedRows = await Tags.update({ description: text },
                                       { where: { name: name, guildID: message.guild.id, userID: message.author.id} });
if (affectedRows > 0) {
  return message.reply(`:white_check_mark: **OK**: Tag **${name}** was edited.`);
}
return message.reply(`:no_entry_sign: **ERROR**: There's no tag with the name **${name}**.`);
} else if (subcommand == "info") {
  // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
  const tag = await Tags.findOne({ where: { name: name, guildID: message.guild.id } });
  if (tag) {
    message.guild.members.fetch(tag.userID).then(function(member) {
    return message.channel.send(`:information_source: **INFO**: The tag **${name}** was created **${moment(tag.createdAt).fromNow()}** by **${member.user.tag}**, and has been used **${tag.usage_count} times**.`);
    });
  } else {
  return message.reply(`:no_entry_sign: **ERROR**: There's no tag with the name **${name}**.`);
  }
} else {
  const tag = await Tags.findOne({ where: { name: subcommand, guildID: message.guild.id } });
  if (tag) {
    function translate(txt) {
      var translate = {
          "{user}": message.author,
  				"{username}": message.author.username,
  				"{tag}": message.author.tag,
  				"{displayname}": message.member.displayName,
  				"{discriminator}": message.author.discriminator,
  				"{userid}": message.author.id
      };

  		for (var key in translate) {
          txt = txt.replace(new RegExp(key, "ig"), translate[key]);
      }

      return (txt.charAt(0) === txt.charAt(0).toUpperCase() ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt.charAt(0) + txt.slice(1))
      }

    var content = translate(tag.get('description'))
    message.channel.send("​" + content)
    // equivalent to UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
    return tag.increment('usage_count');
  } else {
  return message.reply(":no_entry_sign: **NOPE**: There isn't a tag that exists under that name.")
}
}
}



let command = 'tag'
, description = 'Allows you to create a tag with a message.'
, usage = 'tag (create) [name] [message]'
, throttle = {usages: 1, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
