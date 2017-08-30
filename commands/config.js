const Settings = require('./../structures/general/Settings.js');

exports.run = (client, message, args) => {
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
  if (Settings.getValue(message.guild, setting) == undefined) return message.channel.send(":no_entry_sign: **ERROR**: The setting you've provided doesn't exist. Try `+config settings` to see all of the available settings you can view.");
  message.channel.send(":white_check_mark: **OK**: The current value for the setting *" + setting + "* is: __" + Settings.getValue(message.guild, setting) + "__")
}

if (argument == "set") {
  if (setting == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a setting to edit.");
  if (value == undefined) return message.channel.send(":no_entry_sign: **ERROR**: You need to provide a new value to this setting.");
  if (Settings.getValue(message.guild, setting) == undefined) return message.channel.send(":no_entry_sign: **ERROR**: The setting you've provided doesn't exist. Try `+config settings` to see all of the available settings you can view.");

  if (setting == "modLogsChannel" || setting == "memberLogsChannel") {
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
          Settings.editSetting(message.guild, setting, channel.id);
          Settings.saveConfig()
          return;
          } else {
          message.channel.send(":white_check_mark: **OK**: I've set member alerts to be sent to <#" + channel.id + ">.")
          Settings.editSetting(message.guild, setting, channel.id);
          Settings.saveConfig()
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
          Settings.editSetting(message.guild, setting, role.id);
          Settings.saveConfig()
          return;
        } else {
          message.channel.send(":white_check_mark: **OK**: I've set the muted role of this guild to " + role.name + ".")
          Settings.editSetting(message.guild, setting, role.id);
          Settings.saveConfig()
          return;
        }
    }
    return;
  }

  if (setting == "expletiveFilter" || setting == "spamFilter" || setting == "musicNPModule" || setting == "experienceTracking") {
    if (value == "true" || value == "false") {} else {
    return message.channel.send(":no_entry_sign: **ERROR**: You can only change this setting to one of the following values: __true__ or __false__.");
  }
  }

  if (setting == "prefix") {
      value = value.split(" ")[0]
}

  Settings.editSetting(message.guild, setting, value)
  Settings.saveConfig()
  message.channel.send(":white_check_mark: **OK**: I've set the setting *" + setting + "* to __" + value + "__.")
}


if (argument == "settings") {
  message.channel.send(":white_check_mark: **OK**: Here are all of the possible editable settings in zBot:\n**expletiveFilter** **spamFilter** **moderatorRole** **mutedRole** **prefix** **experienceTracking** **musicNPModule** **memberLogsChannel** **modLogsChannel**")
}

}

let command = 'config'
, description = 'Allows you to change the configuration of zBot.'
, usage = 'config **(settings|set|view)** **(setting)** **(value)**'
, permission = 'owner'
, throttle = {usages: 2, duration: 7};
exports.settings = {command: command, description: description, usage: usage, throttle: throttle, permission: permission}
