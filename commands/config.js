const Settings = require('./../structures/general/Settings.js');
const Discord = require('discord.js')

exports.run = async (client, message, args) => {
message.delete();

let argument = args[0]
let setting = args[1]
var value = "";
var argsArray = message.content.split(" ").slice(3);
var arrayLength = argsArray.length;
if (arrayLength > 0) {
    for (let i = 0; i < arrayLength; i++) {
        value = (value + argsArray[i] + " ");
    }
    value = value.trim();
}

if (argument == "view") {
  if (setting == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a setting to view.");
  if (await Settings.getValue(message.guild, setting) == undefined) return message.channel.send(":no_entry_sign: **ERROR**: The setting you've provided doesn't exist. Try `" + await Settings.getValue(message.guild, "prefix") + "help " + this.settings.command + " settings` to see all of the available settings you can view.");

  if (setting == "modLogsChannel" || setting == "memberLogsChannel" || setting == "joinMessageChannel") {
    var channel = message.guild.channels.find("id", await Settings.getValue(message.guild, setting));
    return message.channel.send(":white_check_mark: **OK**: The current value for the setting *" + setting + "* is: __" + channel + "__")
  }

  if (setting == "moderatorRole" || setting == "muteRole") {
    var role = message.guild.roles.find("id", await Settings.getValue(message.guild, setting));
    return message.channel.send(":white_check_mark: **OK**: The current value for the setting *" + setting + "* is: __" + role.name + "__")
  }
  let currentSetting = await Settings.getValue(message.guild, setting)
  message.channel.send(":white_check_mark: **OK**: The current value for the setting *" + setting + "* is: __" + currentSetting + "__")
} else if (argument == "set") {
  if (setting == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a setting to edit.");
  if (value == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a new value to this setting.");
  if (await Settings.getValue(message.guild, setting) == undefined) return message.channel.send(":no_entry_sign: **ERROR**: The setting you've provided doesn't exist. Try `+config settings` to see all of the available settings you can view.");

  if (setting == "modLogsChannel" || setting == "memberLogsChannel" || setting == "joinMessageChannel") {
    var type = "name";
  if (!message.guild.channels.exists("name", value) && !message.guild.channels.exists("id", value)) {
      message.channel.send(":no_entry_sign: **NOPE**: That channel doesn't exist. Please enter the name or ID of a channel and try again.");
      type = "none";
  } else if (message.guild.channels.exists("name", value) && !message.guild.channels.exists("id", value)) {
      type = "name";
    } else {
      type = "id";
    }

    if (type !== "none") {
      var channel = message.guild.channels.find(type, value);
      if (channel.type != "text") {
          message.channel.send(":no_entry_sign: **NOPE**: That's not a text channel.");
          return;
      } else {
          if (setting == "modLogsChannel") {
          message.channel.send(":white_check_mark: **OK**: I've set moderator logs to be sent to <#" + channel.id + ">.")
          await Settings.editSetting(message.guild, setting, channel.id);
          return;
        } else if (setting == "memberLogsChannel") {
          message.channel.send(":white_check_mark: **OK**: I've set member alerts to be sent to <#" + channel.id + ">.")
          await Settings.editSetting(message.guild, setting, channel.id);
          return;
        } else {
          message.channel.send(":white_check_mark: **OK**: I've set member join messages to be sent to <#" + channel.id + ">.")
          await Settings.editSetting(message.guild, setting, channel.id);
          return;
        }
      }
    }
    return;
  }

  if (setting == "moderatorRole" || setting == "muteRole") {
  if (!message.guild.roles.exists("name", value)) {
      message.channel.send(":no_entry_sign: **NOPE**: That role doesn't exist. Please enter the name of a role (ex. Moderator) and try again.");
  } else {
      var role = message.guild.roles.find("name", value);
      if (setting == "moderatorRole") {
          message.channel.send(":white_check_mark: **OK**: I've set the moderator role of this guild to " + role.name + ".")
          await Settings.editSetting(message.guild, setting, role.id);
          return;
        } else {
          message.channel.send(":white_check_mark: **OK**: I've set the muted role of this guild to " + role.name + ".")
          await Settings.editSetting(message.guild, setting, role.id);
          return;
        }
    }
    return;
  }

  if (setting == "expletiveFilter" || setting == "spamFilter" || setting == "musicNPModule" || setting == "experienceTracking" || setting == "joinMessageEnabled") {
    if (value == "true" || value == "false") {
      var isTrueSet = (value == 'true');
      if (isTrueSet) {
      await Settings.editSetting(message.guild, setting, true)
    } else {
      await Settings.editSetting(message.guild, setting, false)
    }
      message.channel.send(":white_check_mark: **OK**: I've set the setting *" + setting + "* to __" + value + "__.")
      return;
    } else {
    return message.channel.send(":no_entry_sign: **ERROR**: You can only change this setting to one of the following values: __true__ or __false__.");
  }
  }

  if (setting == "prefix") {
      value = value.split(" ")[0]
}

  await Settings.editSetting(message.guild, setting, value)
  message.channel.send(":white_check_mark: **OK**: I've set the setting *" + setting + "* to __" + value + "__.")
} else if (argument == "settings") {
  const embed = new Discord.MessageEmbed()
  embed.setAuthor('Settings » ' + message.guild.name, client.user.displayAvatarURL())
  var tosend = []
  Object.entries(await Settings.getAllSettings(message.guild)).forEach(
    ([key, value]) => {
      var settingvalue = value
      if (settingvalue == undefined) settingvalue = "null"
      if (key == "createdAt" || key == "updatedAt" || key == "id" || key == "guildID") return;
      if (message.guild.roles.has(value)) {
        settingvalue = "<@&" + value + ">";
      }

      if (message.guild.channels.has(value)) {
        settingvalue = "<#" + value + ">";
      }

      if (settingvalue.length > 51) {
      tosend.push(`**${key}**  ❯  ${settingvalue.substr(0, 51)}...`)
    } else {
      tosend.push(`**${key}**  ❯  ${settingvalue}`)
    }
    }
  );
  var settings = tosend
  embed.setDescription(":white_check_mark: **OK**: Here are all of the possible editable settings in zBot. To edit any of these settings, type `" + await Settings.getValue(message.guild, "prefix") + "config set [setting] [new value]`.")
  embed.addField("Settings", settings)
  embed.setColor("#34495e")
  message.channel.send({ embed })
  //message.channel.send(":white_check_mark: **OK**: Here are all of the possible editable settings in zBot:\n**expletiveFilter** **spamFilter** **moderatorRole** **muteRole** **prefix** **experienceTracking** **musicNPModule** **memberLogsChannel** **modLogsChannel**")
} else {
  message.reply(":no_entry_sign: **ERROR**: The syntax of the command is incorrect. Try `" + await Settings.getValue(message.guild, "prefix") + "help " + this.settings.command + "` to get more information on this command.")
}

}

let command = 'config'
, description = 'Allows you to change the configuration of zBot.'
, usage = 'config **(settings|set|view)** **(setting)** **(value)**'
, permission = 'owner'
, throttle = {usages: 2, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
