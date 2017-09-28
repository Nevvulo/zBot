const Discord = require('discord.js');
const moment = require('moment')
const fs = require('fs')
const Settings = require('./../structures/general/Settings.js');
const sql = require('sqlite');
sql.open('./data/user/userData.sqlite')

exports.run = (client, message, args) => {
message.delete();
var subcommand = (args[0] == undefined ? "" : args[0].toString())
const name = (args[1] == undefined ? "" : args[1].toString())
const text = args.slice(2).join(' ');

if (subcommand == "create") {
  //TAG MANAGER
  sql.get(`SELECT * FROM tags WHERE guild = '${message.guild.id}' AND tagName = '${name}'`).then(row => {
    if (row !== undefined) {
      return message.reply(":no_entry_sign: **NOPE**: There's already a tag under that name.")
    } else {
    sql.run('INSERT INTO tags (guild, userId, tagName, content) VALUES (?, ?, ?, ?)', [message.guild.id, message.author.id, name, text]);
    message.reply(":white_check_mark: **OK**: You've successfully created the tag **" + name + "**.")
    }
}).catch(() => {
  console.error;
  sql.run('CREATE TABLE IF NOT EXISTS tags (guild TEXT, userId TEXT, tagName TEXT, content TEXT)').then(() => {
    sql.run('INSERT INTO tags (guild, userId, tagName, content) VALUES (?, ?, ?, ?)', [message.guild.id, message.author.id, name, text]);
  });
});
} else if (subcommand == "list") {
  listTags();
	async function listTags() {
  let tosend = []
  var test = await sql.all(`SELECT tagName FROM tags WHERE guild = '${message.guild.id}' AND userId = '${message.author.id}'`);
  //Loop through all users in query and push them to an array.
  for (let i = 0; i < test.length; i++) {
  tosend.push(test[i].tagName)
  }
  message.reply(":white_check_mark: **OK**: Here is a list of all the tags **created by you**: \n" + tosend.join(", ").toString())
  }
} else if (subcommand == "remove") {
  sql.get(`SELECT * FROM tags WHERE guild = '${message.guild.id}' AND tagName = '${name}'`).then(row => {
  if (row == undefined) {
  return message.reply(":no_entry_sign: **NOPE**: There isn't a tag that exists under that name.")
} else {
  sql.run(`DELETE FROM tags WHERE guild = '${message.guild.id}' AND tagName = '${name}'`)
  return message.reply(":white_check_mark: **OK**: You've successfully removed the tag **" + name + "**.")
}
});
} else {
sql.get(`SELECT * FROM tags WHERE guild = '${message.guild.id}' AND tagName = '${subcommand}'`).then(row => {
if (row == undefined) return message.reply(":no_entry_sign: **NOPE**: There isn't a tag that exists under that name.")
if (subcommand == row.tagName) {
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

    var content = translate(row.content)
    message.channel.send("​" + content)
}
});
}
}


let command = 'tag'
, description = 'Allows you to create a tag with a message.'
, usage = 'tag (create) [name] [message]'
, throttle = {usages: 1, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle}
