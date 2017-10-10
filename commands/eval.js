const Discord = require('discord.js');
const Settings = require('./../structures/general/Settings.js');
const Timers = require('./../structures/general/Timers.js');
const Experience = require('./../structures/profile/Experience.js');
const Punish = require('./../structures/moderation/HandlePunish.js');
const Database = require('./../structures/PostgreSQL.js');
const sequelize = require('sequelize');
const sql = require('sqlite');
const Slots = require('./../models/Slots.js');
const User = require('./../models/User.js');
const Badges = require('./../models/Badges.js');
const moment = require('moment');
const colors = require('colors');
sql.open('./data/user/userData.sqlite');
exports.run = async (client, message, args) => {
	const userBadges = await Badges.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
	const userSlots = await Slots.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });
	const userProfile = await User.findOne({ where: { userID: message.author.id, guildID: message.guild.id } });

  function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
  }

  const argseval = message.content.split(" ").slice(1);
  if (message.content.startsWith(await Settings.getValue(message.guild, "prefix") + "eval") && message.author.id == "246574843460321291") {
    try {
      var code = argseval.join(" ");
			var evaled = eval(code)

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
      message.delete();
      const embed = new Discord.MessageEmbed()
      message.channel.send({
        embed: {
          color: 3066993,
          author: {
            name: "ᴇᴠᴀʟ ʀᴇꜱᴜʟᴛ »  ",
            icon_url: message.author.displayAvatarURL
          },
          fields: [{
              name: '**:inbox_tray: Input**',
              value: `\`\`\`js\n${code}\n\`\`\``
						},
            {
              name: '**:outbox_tray: Output**',
              value: `\`\`\`js\n${clean(evaled)}\n\`\`\``
						}
					],
          timestamp: new Date()
        }
      }).then(function(evalmessage) {
				if (Promise.resolve(evaled) == evaled) {
				eval(code).then(function() {
				var finalevaled = ""
				for (key in arguments) {
				    finalevaled += clean(arguments[key]) + "\n";
				}

				evalmessage.edit({
	        embed: {
	          color: 3066993,
	          author: {
	            name: "ᴇᴠᴀʟ ʀᴇꜱᴜʟᴛ »  ",
	            icon_url: message.author.displayAvatarURL
	          },
	          fields: [{
	              name: '**:inbox_tray: Input**',
	              value: `\`\`\`js\n${code}\n\`\`\``
							},
	            {
	              name: '**:outbox_tray: Output**',
	              value: `\`\`\`js\n${clean(finalevaled)}\n\`\`\``
							}
						],
	          timestamp: new Date()
	        }
	      })
				evalmessage.react("🔶");
			})
			} else {
				evalmessage.react("✅");
			}
      })


    } catch (err) {
      message.delete();
      const embed = new Discord.MessageEmbed()
      message.channel.send({
        embed: {
          color: 2600544,
          author: {
            name: "ᴇᴠᴀʟ ᴇʀʀᴏʀ »  ",
            icon_url: message.author.displayAvatarURL
          },
          fields: [{
							name: '**:inbox_tray: Input**',
							value: `\`\`\`js\n${code}\n\`\`\``
						},
            {
              name: '**:no_entry_sign: Error**',
              value: `\`\`\`xl\n${clean(err)}\n\`\`\``
						}
					],
          timestamp: new Date()
        }
      }).then(m => {
        m.react("❌");
      })
    }
  } else {
    message.channel.send(":no_entry_sign: **NOPE**: You don't have permission to use this command.")
  }
}

let command = 'eval',
  description = 'Developer evaluation command.',
  usage = 'eval **[code]**',
  permission = 'dev'
exports.settings = {
  command: command,
  description: description,
  usage: usage,
  permission: permission
}
